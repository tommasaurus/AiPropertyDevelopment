# app/schemas/tenant.py

from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import date
from app.schemas.lease_summary import LeaseSummary

class TenantBase(BaseModel):
    property_id: int
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None    
    landlord: Optional[str] = None  
    address: Optional[str] = None  

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    property_id: int = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    landlord: Optional[str] = None 
    address: Optional[str] = None  

class TenantInDBBase(TenantBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class Tenant(TenantInDBBase):
    leases: Optional[List[LeaseSummary]] = []

    model_config = ConfigDict(from_attributes=True)
