from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON

if TYPE_CHECKING:
    from .support_text import SupportText

class PropostaBase(SQLModel): #Será usada na criação das correções (área do aluno/corretor)
    title: str = Field(index=True)
    created_at: datetime

class Proposta(PropostaBase, table=True):   
    __tablename__: str = "propostas"

    id_proposta: Optional[int] = Field(default=None, primary_key=True)
    support_texts: List["SupportText"] = Relationship(back_populates="proposta") #Relação 1 (Proposta) : N (SupportText)
    tags: List[str] = Field(default=None, sa_type=JSON)

class PropostaPublic(PropostaBase): #Garante que o id nunca será None quando for solicitado (Consumidores da API não precisam verificar se o id é None)
    id: int

class PropostaCreate(PropostaBase):
    support_texts: List["SupportText"]
    tags: List[str]

class PropostaUpdate(PropostaBase):
    title: Optional[str] = None
    created_at: Optional[datetime] = None
    support_texts: Optional[List["SupportText"]] = None
    tags: Optional[List[str]] = None

#Necessário para que a documentação automática funcione
try:
    from .support_text import SupportText
    Proposta.model_rebuild()
    PropostaCreate.model_rebuild()
    PropostaUpdate.model_rebuild()
except Exception as e:
    print(f"Erro models proposta {e}")