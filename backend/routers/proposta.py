from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from database import get_session
from models import Proposta, PropostaCreate, PropostaPublic, PropostaDetail, PropostaUpdate, SupportText

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
        tags=proposta.tags,
        creator_id=proposta.creator_id,
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
        raise HTTPException(status_code=404, detail="Proposta não encontrada")
    return db_proposta

@router.get("/creator/{creator_id}/", response_model=List[PropostaDetail])
def get_propostas_by_creator(
    *,
    session: Session = Depends(get_session),
    creator_id: int,
):
    statement = select(Proposta).where(Proposta.creator_id == creator_id)
    propostas = session.exec(statement).all()
    return propostas

@router.put("/{id_proposta}/")
def update_proposta(
    *,
    session: Session = Depends(get_session),
    id_proposta: int,
    proposta_update: PropostaUpdate,
):
    db_proposta = session.get(Proposta, id_proposta)
    if not db_proposta:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")

    update_data = proposta_update.model_dump(exclude_unset=True, exclude={"support_texts"})
    for field, value in update_data.items():
        setattr(db_proposta, field, value)

    session.add(db_proposta)
    session.commit()
    session.refresh(db_proposta)
    return db_proposta