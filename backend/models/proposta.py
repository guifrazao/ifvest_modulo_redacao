from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON

if TYPE_CHECKING:
    from .support_text import SupportText, SupportTextPublic
    from .essay import Essay

class PropostaBase(SQLModel): #Será usada na criação das correções (área do aluno/corretor)
    title: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)

class Proposta(PropostaBase, table=True):   
    __tablename__: str = "propostas"

    id_proposta: Optional[int] = Field(default=None, primary_key=True)
    support_texts: List["SupportText"] = Relationship(back_populates="proposta") #Relação 1 (Proposta) : N (SupportText)
    tags: List[str] = Field(default=None, sa_type=JSON)

    user_links: List["Essay"] = Relationship(back_populates="proposta")

class PropostaPublic(PropostaBase): #Garante que o id nunca será None quando for solicitado (Consumidores da API não precisam verificar se o id é None)
    id_proposta: int

class PropostaDetail(PropostaPublic):
    support_texts: List["SupportTextPublic"]
    tags: List[str]

class PropostaCreate(PropostaBase):
    support_text_ids: List[int]
    tags: List[str]

class PropostaUpdate(PropostaBase):
    title: Optional[str] = None
    created_at: Optional[datetime] = None
    support_texts: Optional[List["SupportText"]] = None
    tags: Optional[List[str]] = None

#Necessário para que a documentação automática funcione
try:
    from .support_text import SupportText, SupportTextPublic
    from .essay import Essay
    Proposta.model_rebuild()
    PropostaDetail.model_rebuild()
    PropostaCreate.model_rebuild()
    PropostaUpdate.model_rebuild()
except Exception as e:
    print(f"Erro models proposta {e}")