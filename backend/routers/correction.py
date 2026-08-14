from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from core import settings
from database import get_session
from models import Correction, CorrectionPublic, CorrectionCreate, CorrectionUpdate, Comment, User, Essay, SupportText
from schemas import EssayWithProposta, CorrectionNoGrades
from ai.ai_correction import corretor, plagio
from ai.ai_correction.corretor import ErroDeCorrecao

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

    if len(db_comments) != len(correction.comment_ids):
        raise HTTPException(status_code=404, detail="Um ou mais comentários informados não foram encontrados")
    
    db_correction = Correction(
        c1_score=correction.c1_score,
        c2_score=correction.c2_score,
        c3_score=correction.c3_score,
        c4_score=correction.c4_score,
        c5_score=correction.c5_score,
        corrected_at=correction.corrected_at,
        general_feedback=correction.general_feedback,
        essay_id=correction.essay_id,
        corrector_id=correction.corrector_id,
        comments=db_comments,
    )

    session.add(db_correction)
    session.commit()
    session.refresh(db_correction)

    return CorrectionPublic(
        id=db_correction.id,
        c1_score=correction.c1_score,
        c2_score=correction.c2_score,
        c3_score=correction.c3_score,
        c4_score=correction.c4_score,
        c5_score=correction.c5_score,
        corrected_at=correction.corrected_at,
        corrector_name=corrector.name,
        comments=db_comments,
    )

#TODO: CORREÇÃO OBRIGATORIAMENTE PRECISA DE UM USUÁRIO, FAZER COM QUE ESSE NAO SEJA O CASO
@router.post("/ai/create/", response_model=CorrectionPublic)
def create_ai_correction(
    *,
    session: Session = Depends(get_session),
    correction: CorrectionNoGrades,
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

    if len(db_comments) != len(correction.comment_ids):
        raise HTTPException(status_code=404, detail="Um ou mais comentários informados não foram encontrados")
    
    db_support_texts = essay.proposta.support_texts

    textos_apoio_adaptados = ""
    for support_text in db_support_texts:
        if support_text.content:
            textos_apoio_adaptados += support_text.content + " "

    textos_apoio_adaptados = textos_apoio_adaptados.strip() or None

    retorno_plagio = plagio.detectar_copia(essay.submitted_text, textos_apoio_adaptados)

    try:
        ai_correction = corretor.corrigir_redacao(
            redacao=essay.submitted_text,
            titulo_tema=essay.proposta.title,
            textos_apoio=textos_apoio_adaptados,
            plagio=retorno_plagio,
            api_key=settings.ANTHROPIC_API_KEY,
        )
    except ErroDeCorrecao as e:
        raise HTTPException(status_code=e.status, detail=e.mensagem)

    feedback = f"""
COMPETÊNCIA 1:
{ai_correction.competencias[0].feedback}

COMPETÊNCIA 2:
{ai_correction.competencias[1].feedback}

COMPETÊNCIA 3:
{ai_correction.competencias[2].feedback}

COMPETÊNCIA 4:
{ai_correction.competencias[3].feedback}

COMPETÊNCIA 5:
{ai_correction.competencias[4].feedback}

COMENTÁRIOS GERAIS:
{ai_correction.melhorias}"""

    db_correction = Correction(
            c1_score=ai_correction.competencias[0].nota,
            c2_score=ai_correction.competencias[1].nota,
            c3_score=ai_correction.competencias[2].nota,
            c4_score=ai_correction.competencias[3].nota,
            c5_score=ai_correction.competencias[4].nota,
            general_feedback=feedback,
            essay_id=correction.essay_id,
            corrector_id=correction.corrector_id,
            comments=db_comments,
        )

    essay.status = "done"
    
    session.add(db_correction)
    session.add(essay)
    session.commit()
    session.refresh(db_correction)

    return CorrectionPublic(
        id=db_correction.id,
        c1_score=ai_correction.competencias[0].nota,
        c2_score=ai_correction.competencias[1].nota,
        c3_score=ai_correction.competencias[2].nota,
        c4_score=ai_correction.competencias[3].nota,
        c5_score=ai_correction.competencias[4].nota,
        corrected_at=db_correction.corrected_at,
        general_feedback=feedback,
        corrector_name="IA IFVEST",
        comments=db_comments,
    )

@router.put("/{essay_id}/", response_model=CorrectionPublic)
def update_correction(
    *,
    session: Session = Depends(get_session),
    essay_id,
    correction_update: CorrectionUpdate,
):
    essay = session.get(Essay, essay_id)
    if not essay:
        raise HTTPException(status_code=404, detail="Redação não encontrada")

    db_correction = essay.correction
    if db_correction is None:
        raise HTTPException(status_code=404, detail="Essa redação não possui correção")

    update_data = correction_update.model_dump(exclude_unset=True, exclude={"comment_ids"})
    for field, value in update_data.items():
        setattr(db_correction, field, value)

    if correction_update.comment_ids is not None:
        statement = select(Comment).where(Comment.id.in_(correction_update.comment_ids))
        db_comments = session.exec(statement).all()

        if len(db_comments) != len(correction_update.comment_ids):
            raise HTTPException(status_code=404, detail="Um ou mais comentários não foram encontrados")

        db_correction.comments = db_comments

    essay.status = "done"

    session.add(db_correction)
    session.add(essay)
    session.commit()
    session.refresh(db_correction)

    return CorrectionPublic(
        id=db_correction.id,
        c1_score=db_correction.c1_score,
        c2_score=db_correction.c2_score,
        c3_score=db_correction.c3_score,
        c4_score=db_correction.c4_score,
        c5_score=db_correction.c5_score,
        corrected_at=db_correction.corrected_at,
        general_feedback=db_correction.general_feedback,
        corrector_name=db_correction.corrector.name,
        comments=db_correction.comments,
    )


