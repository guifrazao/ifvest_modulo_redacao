from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from database import get_session
from models import Essay, EssayPublic, EssayCreate, Proposta, User
from schemas import EssayWithProposta, EssayWithPropostaDetail, CorrectionPublic

router = APIRouter(
    prefix = "/essay",
    tags = ["essay"]
)

@router.post("/create/", response_model=EssayPublic)
def create_essay(
    *,
    session: Session = Depends(get_session),
    essay: EssayCreate,
):
    proposta = session.get(Proposta, essay.proposta_id)
    if not proposta:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")
    
    user = session.get(User, essay.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db_essay = Essay(
        submitted_text=essay.submitted_text,
        image_url=essay.image_url,
        submitted_at=essay.submitted_at,
        user_id=essay.user_id,
        proposta_id=essay.proposta_id,
    )
    
    session.add(db_essay)
    session.commit()
    session.refresh(db_essay)

    return db_essay

@router.get("/{essay_id}", response_model=EssayWithPropostaDetail)
def get_essay_by_id(
    *,
    session: Session = Depends(get_session),
    essay_id: int
):
    statement = select(Essay).where(Essay.id == essay_id)
    essay = session.exec(statement).one()

    correction_public = None
    if essay.correction is not None:
        correction_public = CorrectionPublic(
            id=essay.correction.id,
            c1_score=essay.correction.c1_score,
            c2_score=essay.correction.c2_score,
            c3_score=essay.correction.c3_score,
            c4_score=essay.correction.c4_score,
            c5_score=essay.correction.c5_score,
            corrected_at=essay.correction.corrected_at,
            corrector_name=essay.correction.corrector.name,
            comments=essay.correction.comments,
        )

    result = EssayWithPropostaDetail(
        id=essay.id,
        status=essay.status,
        title=essay.proposta.title,
        submitted_text=essay.submitted_text,
        image_url=essay.image_url,
        submitted_at=essay.submitted_at,
        support_texts=essay.proposta.support_texts,
        correction=correction_public,
    )

    return result

@router.get("/pending/", response_model=List[EssayWithProposta])
def get_pending_essays(
    *,
    session: Session = Depends(get_session)
):
    statement = select(Essay).where(Essay.status != "done")
    essays = session.exec(statement).all()

    result = []
    for essay in essays:
        result.append(EssayWithProposta(
            id=essay.id,
            submitted_text=essay.submitted_text,
            image_url=essay.image_url,
            submitted_at=essay.submitted_at,
            status=essay.status,
            title=essay.proposta.title,
        ))

    return result

@router.get("/user/{user_id}/", response_model=List[EssayWithProposta])
def get_essays_by_user(
    *,
    session: Session = Depends(get_session),
    user_id: int
):
    statement = select(Essay).where(Essay.user_id == user_id)
    essays = session.exec(statement).all()

    result = []
    for essay in essays:
        result.append(EssayWithProposta(
            id=essay.id,
            submitted_text=essay.submitted_text,
            image_url=essay.image_url,
            submitted_at=essay.submitted_at,
            status=essay.status,
            title=essay.proposta.title,
        ))

    return result