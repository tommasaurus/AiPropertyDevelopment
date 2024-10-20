# app/schemas/lease.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class LeaseBase(BaseModel):
    property_id: int
    tenant_id: int
    lease_type: str
    rent_amount: float
    security_deposit: Optional[float] = None
    start_date: date
    end_date: date
    lease_terms: Optional[str] = None
    payment_frequency: Optional[str] = 'Monthly'
    is_active: Optional[bool] = True

class LeaseCreate(LeaseBase):
    pass

class LeaseUpdate(BaseModel):
    lease_type: Optional[str] = None
    rent_amount: Optional[float] = None
    security_deposit: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    lease_terms: Optional[str] = None
    payment_frequency: Optional[str] = None
    is_active: Optional[bool] = None

class LeaseInDBBase(LeaseBase):
    id: int

    class Config:
        orm_mode = True

class Lease(LeaseInDBBase):
    pass
