from typing import List, Optional, TYPE_CHECKING
from pydantic import model_validator
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON

if TYPE_CHECKING:
    from .support_text import SupportText
    from .proposta import Proposta
    from .user import User
    from .correction import Correction

class EssayBase(SQLModel):
    submitted_text: Optional[str] = Field(default=None,index=True)
    image_url: Optional[str] = Field(default=None,index=True)
    submitted_at: datetime = Field(default_factory=datetime.now)

    @model_validator(mode="after")
    def validate_fields_by_type(self):
        if not self.submitted_text and not self.image_url:
            raise ValueError("A submissão de algum texto/imagem é obrigatório")
        return self

class Essay(EssayBase, table=True):
    __tablename__: str = "essays"

    id: Optional[int] = Field(default=None, primary_key=True)
    status: str = Field(default="awaiting_correction")

    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    proposta_id: Optional[int] = Field(default=None, foreign_key="propostas.id_proposta")
    user: "User" = Relationship(back_populates="proposta_links")
    proposta: "Proposta" = Relationship(back_populates="user_links")
    correction: "Correction" = Relationship(back_populates="essay")

class EssayPublic(EssayBase):
    id: int
    status: str

class EssayCreate(EssayBase):
    user_id: int
    proposta_id: int

class EssayUpdate(EssayBase):
    submitted_text: Optional[str] = None
    image_url: Optional[str] = None
    submitted_at: Optional[str] = None

try:
    from .support_text import SupportText
    from .proposta import Proposta
    from .user import User

    Essay.model_rebuild()
    EssayCreate.model_rebuild()
    EssayUpdate.model_rebuild()
except Exception as e:
    print(f"Erro models essay: {e}")