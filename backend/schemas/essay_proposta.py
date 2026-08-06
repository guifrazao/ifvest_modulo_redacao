from models import EssayPublic, SupportTextPublic, CorrectionPublic
from typing import List, Optional

class EssayWithProposta(EssayPublic):
    status: str
    title: str

class EssayWithPropostaDetail(EssayWithProposta):
    submitted_text: str
    support_texts: List[SupportTextPublic]
    correction: Optional[CorrectionPublic] = None