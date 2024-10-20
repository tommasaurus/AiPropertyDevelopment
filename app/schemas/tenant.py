# app/schemas/tenant.py

from pydantic import BaseModel, EmailStr
from typing import Optional

class TenantBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None  # Use datetime/date types if needed

class TenantCreate(TenantBase):
    pass

class TenantUpdate(TenantBase):
    pass

class TenantInDBBase(TenantBase):
    id: int

    class Config:
        orm_mode = True

class Tenant(TenantInDBBase):
    pass
