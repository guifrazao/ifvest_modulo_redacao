from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON

if TYPE_CHECKING:
    from .support_text import SupportText
    from .proposta import Proposta
    from .essay import Essay
    from .correction import Correction

class UserBase(SQLModel):
    name: str = Field(index=True)
    type: str = Field(default="student")

class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    
    proposta_links: List["Essay"] = Relationship(back_populates="user")
    corrections_made: List["Correction"] = Relationship (back_populates="corrector")

class UserPublic(UserBase):
    id: int

class UserCreate(UserBase):
    type: str = "student"

class UserUpdate(UserBase):
    name: Optional[str] = None
    type: Optional[str] = None

try:
    from .support_text import SupportText
    from .proposta import Proposta
    from .essay import Essay

    User.model_rebuild()
    UserUpdate.model_rebuild()
except Exception as e:
    print(f"Erro models user: {e}")