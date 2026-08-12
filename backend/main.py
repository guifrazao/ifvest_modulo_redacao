
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core import settings
from database import create_db_and_tables
from models import SupportText, Proposta, User
from routers import teste_ocr, proposta, support_text, user, essay, comment, correction

#Necessário para realizar tarefas no start up/encerramento da execução
@asynccontextmanager
async def lifespan(app: FastAPI):
    #Tudo antes do yield é executado no start up
    create_db_and_tables()
    yield
    #Tudo depois do yield é executado no encerramento

app = FastAPI(
    title="API IFVest - Domínio redações",
    description="Domínio do módulo de redações da API IFVest",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="./static/uploads"), name="static")

app.include_router(teste_ocr.router, prefix=settings.API_PREFIX)
app.include_router(proposta.router, prefix=settings.API_PREFIX)
app.include_router(support_text.router, prefix=settings.API_PREFIX)
app.include_router(essay.router, prefix=settings.API_PREFIX)
app.include_router(user.router, prefix=settings.API_PREFIX)
app.include_router(comment.router, prefix=settings.API_PREFIX)
app.include_router(correction.router, prefix=settings.API_PREFIX)
app.router.redirect_slashes=False

if __name__ == "__main__": 
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)