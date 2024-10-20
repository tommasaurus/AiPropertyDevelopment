# app/core/auth/models.py

from pydantic import BaseModel, EmailStr
from typing import Optional

# User login request model
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User creation request model (for signup)
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Token response model
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

# Token data model (for token verification)
class TokenData(BaseModel):
    email: Optional[EmailStr] = None
