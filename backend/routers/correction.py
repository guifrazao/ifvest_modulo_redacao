from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from database import get_session
from models import Correction, CorrectionPublic, CorrectionCreate, Comment, User, Essay
from schemas import EssayWithProposta

router = APIRouter(
    prefix = "/correction",
    tags = ["correction"]
)

@router.post("/create/", response_model=CorrectionPublic)
def create_correction(
    *,
    session: Session = Depends(get_session),
    correction: CorrectionCreate,
):
    essay = session.get(Essay, correction.essay_id)
    if not essay:
        raise HTTPException(status_code=404, detail="Redação não encontrada")

    if essay.correction is not None:
        raise HTTPException(status_code=400, detail="Esta redação já possui uma correção")

    corrector = session.get(User, correction.corrector_id)
    if not corrector:
        raise HTTPException(status_code=404, detail="Corretor não encontrado")

    if corrector.type != "professor":
        raise HTTPException(status_code=400, detail="Apenas professores podem realizar correções")
    
    statement = select(Comment).where(Comment.id.in_(correction.comment_ids)) 
    db_comments = session.exec(statement).all()
    
    db_correction = Correction(
        c1_score=correction.c1_score,
        c2_score=correction.c2_score,
        c3_score=correction.c3_score,
        c4_score=correction.c4_score,
        c5_score=correction.c5_score,
        corrected_at=correction.corrected_at,
        essay_id=correction.essay_id,
        corrector_id=correction.corrector_id,
        comments=db_comments,
    )

    session.add(db_correction)
    session.commit()
    session.refresh(db_correction)

    return db_correction