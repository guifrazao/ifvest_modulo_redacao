from fastapi import APIRouter, Depends, Form, HTTPException
from sqlmodel import Session
from database import get_session
from models import SupportText, SupportTextPublic, SupportTextUpdate

router = APIRouter(
    prefix="/support_text",
    tags=["support_text"]
)

@router.post("/create_text/", response_model=SupportTextPublic)
def create_support_text_text(
    *, 
    session: Session = Depends(get_session), 
    title: str = Form(...),
    type: str = Form(...),
    content: str = Form(None),
    image_url: str = Form(None),
    source: str = Form(...),
    id_proposta: int = Form(None),
):
    db_support_text = SupportText(
        title=title,
        type=type,
        content=content,
        image_url=image_url,
        source=source,
        id_proposta=id_proposta,
    )

    session.add(db_support_text)
    session.commit()
    session.refresh(db_support_text)
    return db_support_text

@router.put("/{support_text_id}/", response_model=SupportTextPublic)
def update_support_text(
    *,
    session: Session = Depends(get_session),
    support_text_id: int,
    support_text_update: SupportTextUpdate,
):
    db_support_text = session.get(SupportText, support_text_id)
    if not db_support_text:
        raise HTTPException(status_code=404, detail="Texto de apoio não encontrado")

    update_data = support_text_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_support_text, field, value)

    session.add(db_support_text)
    session.commit()
    session.refresh(db_support_text)
    return db_support_text

@router.delete("/{support_text_id}/")
def delete_support_text(
    *,
    session: Session = Depends(get_session),
    support_text_id: int,
):
    db_support_text = session.get(SupportText, support_text_id)
    if not db_support_text:
        raise HTTPException(status_code=404, detail="Texto de apoio não encontrado")

    session.delete(db_support_text)
    session.commit()
    return {"ok": True}