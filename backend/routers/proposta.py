from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import Proposta, PropostaCreate, PropostaPublic

router = APIRouter(
    prefix="/proposta",
    tags=["proposta"]
)

@router.post("/create", response_model=PropostaPublic)
def create_support_text(*, session: Session = Depends(get_session), proposta: PropostaCreate):
    db_proposta = Proposta.model_validate(proposta)
    session.add(db_proposta)
    session.commit()
    session.refresh(db_proposta)
    return db_proposta