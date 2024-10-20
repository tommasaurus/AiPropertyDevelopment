# app/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.schemas.property import Property

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    profile_pic: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    profile_pic: Optional[str] = None
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True

class User(UserInDBBase):
    properties: Optional[List[Property]] = []
