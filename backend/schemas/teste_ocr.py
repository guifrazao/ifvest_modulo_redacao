
from pydantic import BaseModel
from fastapi import UploadFile

class GroqAIResponse(BaseModel):
    texto_extraido: str

class GroqAIRequest(BaseModel):
    file: UploadFile