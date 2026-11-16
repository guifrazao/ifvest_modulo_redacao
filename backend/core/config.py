from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    DATABASE_URL: str

    API_PREFIX: str = "/api"

    ALLOWED_ORIGINS: str = ""
    GROQ_API_KEY: str = ""

    MODEL: str
    MAX_TOKENS: int
    EFFORT: str
    MONTHLY_LIMIT: int
    ANTHROPIC_API_KEY: str

    # Caminho do arquivo JSON com as redações de referência que calibram a
    # correção da IA. Vazio desliga a ancoragem, e a correção fica como está
    # hoje — medida em QWK 0,514 contra as corretoras do simulado, com erro de
    # até 260 pontos para cima em redação de nota baixa.
    #
    # Com o arquivo, a medição deu QWK 0,703 e erro 39% menor nas fracas.
    # Formato do arquivo e critérios de escolha das âncoras estão documentados
    # em `ai/ai_correction/ancoragem.py`.
    ANCORAS: str = ""


    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return v.split(",") if v else []

    @property
    def ancoras_path(self) -> Optional[Path]:
        """Caminho das âncoras, ou None quando a ancoragem está desligada."""
        return Path(self.ANCORAS) if self.ANCORAS.strip() else None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()