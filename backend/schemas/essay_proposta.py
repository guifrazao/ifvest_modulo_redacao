from models import EssayPublic, SupportTextPublic, CorrectionPublic, PropostaPublic
from typing import List, Optional

class EssayWithProposta(EssayPublic):
    status: str
    title: str

class EssayWithPropostaDetail(EssayWithProposta):
    submitted_text: str
    support_texts: List[SupportTextPublic]
    correction: Optional[CorrectionPublic] = None

class PropostaListItem(PropostaPublic):
    tags: List[str] = []
    status: str = "not_done"