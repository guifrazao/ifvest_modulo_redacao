from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from schemas import GroqAIResponse
from routers import teste_ocr
from ocr_groq_vlm import GroqVLMOCR

app = FastAPI(
    title="API IFVest - Domínio redações",
    description="Domínio do módulo de redações da API IFVest",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teste_ocr.router, prefix=settings.API_PREFIX)
app.router.redirect_slashes=False

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)