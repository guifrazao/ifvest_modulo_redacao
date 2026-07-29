from fastapi import APIRouter, Depends, Form, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import datetime
from database import get_session
from models import User, UserPublic, UserCreate

router = APIRouter(
    prefix = "/usuario",
    tags = ["usuario"]
)

@router.post("/create/", response_model=UserPublic)
def create_user(
    *,
    session: Session = Depends(get_session),
    user: UserCreate,
):
    db_user = User.model_validate(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user