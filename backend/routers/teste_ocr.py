import os
from fastapi import APIRouter, File, UploadFile
from schemas.teste_ocr import GroqAIResponse
from ocr_groq_vlm import groq_vlm

router = APIRouter(
    prefix="/ocr",
    tags=["extrair_texto"],
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