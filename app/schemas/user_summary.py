# app/schemas/user_summary.py

from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class UserSummary(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
