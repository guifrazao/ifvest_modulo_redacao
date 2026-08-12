import os
from fastapi import APIRouter, File, UploadFile, Depends
from schemas.teste_ocr import GroqAIResponse
from schemas import CorrecaoIA
from ai import groq_vlm
from sqlmodel import Session, select
from database import get_session
from models import SupportText, EssayPublic
from ai.ai_correction import corretor, plagio

router = APIRouter(
    prefix="/ai",
    tags=["extrair_texto", "ai_correction"],
)

@router.post("/extrair_texto/", response_model=GroqAIResponse)
async def upload_redacao(file: UploadFile = File(...)):
    caminho_temporario_imagem = f"temporario_{file.filename}"
    conteudo_binario = await file.read()

    with open(caminho_temporario_imagem, "wb") as arquivo_local:
        arquivo_local.write(conteudo_binario)

    teste_groq = groq_vlm.extract_image_file(caminho_temporario_imagem)

    if os.path.exists(caminho_temporario_imagem):
        os.remove(caminho_temporario_imagem)



    return GroqAIResponse(texto_extraido=teste_groq.replace("\n", " "))

# @router.post("/ai_correction", response_model=CorrecaoIA)
# def ai_correct(
#     *,
#     session: Session = Depends(get_session),
#     essay: EssayPublic
# ):
#     statement = select(SupportText).where(SupportText.id.in_(essay.proposta.support_text_ids)) 
#     db_support_texts = session.exec(statement).all()

#     textos_apoio_adaptados = ""
#     for support_text in db_support_texts:
#         textos_apoio_adaptados += support_text.content + " "

#     print(textos_apoio_adaptados)

#     retorno_plagio = plagio.detectar_copia(essay.submitted_text, textos_apoio_adaptados)

#     ai_correction = corretor.corrigir_redacao(
#             redacao=essay.submitted_text,
#             titulo_tema=essay.proposta.title,
#             textos_apoio=textos_apoio_adaptados,
#             plagio=retorno_plagio,
#     )

#     feedback = f"""{ai_correction.competencias[0].feedback}

#                         {ai_correction.competencias[1].feedback}

#                         {ai_correction.competencias[2].feedback}

#                         {ai_correction.competencias[3].feedback}

#                         {ai_correction.competencias[4].feedback}

#                         {ai_correction.melhorias}
#     """

#     print(feedback)

    