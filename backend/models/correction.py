# models/correction.py
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .essay import Essay
    from .user import User
    from .comment import Comment, CommentPublic

class CorrectionBase(SQLModel):
    c1_score: int = Field(ge=0, le=200)
    c2_score: int = Field(ge=0, le=200)
    c3_score: int = Field(ge=0, le=200)
    c4_score: int = Field(ge=0, le=200)
    c5_score: int = Field(ge=0, le=200)
    corrected_at: datetime = Field(default_factory=datetime.now)

class Correction(CorrectionBase, table=True):
    __tablename__ = "corrections"

    id: Optional[int] = Field(default=None, primary_key=True)
    essay_id: int = Field(foreign_key="essays.id", unique=True)  # 1:1
    corrector_id: int = Field(foreign_key="users.id")

    essay: "Essay" = Relationship(back_populates="correction")
    corrector: "User" = Relationship(back_populates="corrections_made")
    comments: List["Comment"] = Relationship(back_populates="correction")

class CorrectionPublic(CorrectionBase):
    id: int
    corrector_name: str
    comments: List["CommentPublic"] = []

class CorrectionCreate(CorrectionBase):
    essay_id: int
    corrector_id: int
    comment_ids: List[int]

class CorrectionUpdate(CorrectionBase):
    c1_score: Optional[int] = Field(default=None, ge=0, le=200)
    c2_score: Optional[int] = Field(default=None, ge=0, le=200)
    c3_score: Optional[int] = Field(default=None, ge=0, le=200)
    c4_score: Optional[int] = Field(default=None, ge=0, le=200)
    c5_score: Optional[int] = Field(default=None, ge=0, le=200)
    comment_ids: Optional[List[int]] = None

try:
    from .essay import Essay
    from .user import User
    from .comment import Comment, CommentPublic
    Correction.model_rebuild()
    CorrectionPublic.model_rebuild()
    CorrectionCreate.model_rebuild()
    CorrectionUpdate.model_rebuild()
except Exception as e:
    print(f"Erro models correction: {e}")