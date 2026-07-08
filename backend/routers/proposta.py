from fastapi import APIRouter, Depends, Form
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from database import get_session
from models import Proposta, PropostaCreate, PropostaPublic, PropostaDetail, SupportText

router = APIRouter(
    prefix="/proposta",
    tags=["proposta"]
)

@router.post("/create/", response_model=PropostaPublic)
def create_proposta(
    *, 
    session: Session = Depends(get_session), 
    proposta: PropostaCreate,
):
    statement = select(SupportText).where(SupportText.id.in_(proposta.support_text_ids)) 
    db_support_texts = session.exec(statement).all()

    db_proposta = Proposta(
        title=proposta.title,
        created_at=proposta.created_at,
        support_texts=db_support_texts,
        tags=proposta.tags
    )
    session.add(db_proposta)
    session.commit()
    session.refresh(db_proposta)
    return db_proposta

@router.get("/")
def get_todas_propostas(
    session: Session = Depends(get_session),
):
    statement = select(Proposta)
    results = session.exec(statement)
    propostas = results.all()
    return propostas

@router.get("/{id_proposta}/", response_model=PropostaDetail)
def get_proposta(
    *,
    session: Session = Depends(get_session),
    id_proposta: int
):
    db_proposta = session.get(Proposta, id_proposta)
    if not db_proposta:
        raise Exception("Proposta não encontrada")
    return db_proposta