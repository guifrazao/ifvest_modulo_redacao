from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List, Optional
from sqlmodel import Session, select, delete
from datetime import datetime
from database import get_session
from models import Proposta, PropostaCreate, PropostaPublic, PropostaDetail, PropostaUpdate, SupportText, Essay
from schemas import PropostaListItem

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

@router.get("/", response_model=List[PropostaListItem])
def get_todas_propostas(
    session: Session = Depends(get_session),
    user_id: Optional[int] = None,
):
    statement = select(Proposta)
    propostas = session.exec(statement).all()

    result = []

    for proposta in propostas:
        status = "not_done"
        if user_id is not None:
            essay = next((e for e in proposta.user_links if e.user_id == user_id), None)
            if essay is not None:
                status = essay.status

        result.append(PropostaListItem(
            id_proposta=proposta.id_proposta,
            title=proposta.title,
            created_at=proposta.created_at,
            tags=proposta.tags,
            status=status,        
        ))

    return result

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

@router.delete("/{id_proposta}/")
def delete_proposta(
    *,
    session: Session = Depends(get_session),
    id_proposta: int,
):
    db_proposta = session.get(Proposta, id_proposta)
    if not db_proposta:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")

    statement = select(Essay).where(Essay.proposta_id == id_proposta)
    db_essay = session.exec(statement).first()

    if db_essay:
        raise HTTPException(status_code=400, detail="Propostas que possuem redações já feitas não podem ser apagadas")

    statement = delete(SupportText).where(SupportText.id_proposta == id_proposta)
    session.exec(statement)

    session.delete(db_proposta)
    session.commit()

    