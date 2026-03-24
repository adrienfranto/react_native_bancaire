import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "React Native Bancaire API"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:devsecops@localhost/react_native_bancaire"
    )

    class Config:
        case_sensitive = True

settings = Settings()
