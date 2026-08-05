from models import EssayPublic, SupportTextPublic
from typing import List

class EssayWithProposta(EssayPublic):
    status: str
    title: str

class EssayWithPropostaDetail(EssayWithProposta):
    submitted_text: str
    support_texts: List[SupportTextPublic]