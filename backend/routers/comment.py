from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from database import get_session
from models import Comment, CommentPublic, CommentCreate, Correction
from schemas import EssayWithProposta

router = APIRouter(
    prefix = "/comment",
    tags = ["comment"]
)

@router.post("/create/", response_model=CommentPublic)
def create_comment(
    *,
    session: Session = Depends(get_session),
    comment: CommentCreate,
):
    db_comment = Comment(
        competence=comment.competence,
        content=comment.content,
        start_offset=comment.start_offset,
        end_offset=comment.end_offset,
    )

    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)

    return db_comment