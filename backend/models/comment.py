from typing import List, Optional, TYPE_CHECKING
from pydantic import model_validator
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON

if TYPE_CHECKING:
    from .correction import Correction

class CommentBase(SQLModel):
    competence: str = Field()
    content: str = Field()
    start_offset: int = Field()
    end_offset: int = Field()

class Comment(CommentBase, table=True):
    __tablename__ = "comments"

    id: Optional[int] = Field(default=None, primary_key=True)
    correction_id: Optional[int] = Field(foreign_key="corrections.id")
    correction: "Correction" = Relationship(back_populates="comments")

class CommentPublic(CommentBase):
    id: int

class CommentCreate(CommentBase):
    pass

try:
    from .correction import Correction
    Comment.model_rebuild()
    CommentCreate.model_rebuild()
except Exception as e:
    print(f"Erro models comments: {e}")
