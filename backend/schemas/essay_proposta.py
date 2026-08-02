from models import EssayPublic

class EssayWithProposta(EssayPublic):
    status: str
    title: str

class EssayWithPropostaDetail(EssayWithProposta):
    submitted_text: str