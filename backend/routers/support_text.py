from fastapi import APIRouter, Depends, Form
from sqlmodel import Session
from database import get_session
from models import SupportText, SupportTextPublic

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
    source: str = Form(...)
):
    db_support_text = SupportText(
        title=title,
        type=type,
        content=content,
        source=source,
    )

    session.add(db_support_text)
    session.commit()
    session.refresh(db_support_text)
    return db_support_text