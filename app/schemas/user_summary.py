# app/schemas/user_summary.py

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSummary(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None

    class Config:
        orm_mode = True
