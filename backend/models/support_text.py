from typing import List, Optional, TYPE_CHECKING
from pydantic import model_validator
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .proposta import Proposta

class SupportTextBase(SQLModel):
    title: str = Field()
    type: str = Field()
    content: Optional[str] = Field(default=None)
    image_url: Optional[str] = Field(default=None)

    @model_validator(mode="after")
    def validate_fields_by_type(self):
        if self.type == "text" and not self.content:
            raise ValueError("O campo 'content' é obrigatório quando 'type' é 'text")
        if self.type == "image" and not self.content:
            raise ValueError("O campo 'image_url' é obrigatório quando 'type' é 'image")

class SupportText(SupportTextBase, table=True):
    __tablename__: str = "support_texts"

    id: Optional[int] = Field(default=None, primary_key=True)
    source: str = Field(index=True)
    id_proposta: Optional[int] = Field(default=None, foreign_key="propostas.id_proposta") #Relação N (SupportText) : 1 (Proposta)
    proposta: Optional["Proposta"] = Relationship(back_populates="support_texts")

class SupportTextPublic(SupportTextBase):
    id: int

class SupportTextCreate(SupportTextBase):
    source: str

class SupportTextUpdate(SupportTextBase):
    title: Optional[str] = None
    content: Optional[str] = None
    source: Optional[str] = None

#Necessário para que a documentação automática funcione
try:
    from .proposta import Proposta
    SupportText.model_rebuild()
    SupportTextCreate.model_rebuild()
    SupportTextUpdate.model_rebuild()
except Exception:
    pass