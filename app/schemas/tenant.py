# app/schemas/tenant.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from app.schemas.lease_summary import LeaseSummary
from app.schemas.document_summary import DocumentSummary

class TenantBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None

class TenantInDBBase(TenantBase):
    id: int

    class Config:
        orm_mode = True

class Tenant(TenantInDBBase):
    leases: Optional[List[LeaseSummary]] = []
    documents: Optional[List[DocumentSummary]] = []

    class Config:
        orm_mode = True
