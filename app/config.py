# app/config.py
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    REGRID_API_KEY: str = Field(..., env="REGRID_API_KEY")
    GOOGLE_STREET_VIEW_API_KEY: str = Field(..., env="GOOGLE_STREET_VIEW_API_KEY")

    class Config:
        env_file = ".env"

settings = Settings()
