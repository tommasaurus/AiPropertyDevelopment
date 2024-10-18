# app/config.py
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    REGRID_API_KEY: str = Field(..., env="REGRID_API_KEY")
    GOOGLE_STREET_VIEW_API_KEY: str = Field(..., env="GOOGLE_STREET_VIEW_API_KEY")
    
    # OAuth client details for Google
    GOOGLE_CLIENT_ID: str = Field(..., env="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = Field(..., env="GOOGLE_CLIENT_SECRET")

    # JWT configuration
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    REFRESH_SECRET_KEY: str = Field(..., env="REFRESH_SECRET_KEY")  # Separate key for refresh tokens
    ALGORITHM: str = "HS256"  # Common algorithm for both access and refresh tokens
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes for access token expiration
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # Refresh tokens last 7 days

    class Config:
        env_file = ".env"

settings = Settings()
