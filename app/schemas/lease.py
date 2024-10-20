# app/schemas/lease.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.property_summary import PropertySummary
from app.schemas.tenant_summary import TenantSummary
from app.schemas.payment_summary import PaymentSummary
from app.schemas.document_summary import DocumentSummary

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
    property: PropertySummary
    tenant: TenantSummary
    payments: Optional[List[PaymentSummary]] = []
    documents: Optional[List[DocumentSummary]] = []

    class Config:
        orm_mode = True
