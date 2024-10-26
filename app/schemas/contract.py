# app/schemas/contract.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.property_summary import PropertySummary
from app.schemas.vendor_summary import VendorSummary

class ContractBase(BaseModel):
    property_id: int
    vendor_id: int
    contract_type: str
    start_date: date
    end_date: Optional[date] = None
    terms: Optional[str] = None
    is_active: Optional[bool] = True

class ContractCreate(ContractBase):
    pass

class ContractUpdate(BaseModel):
    property_id: Optional[int] = None
    vendor_id: Optional[int] = None
    contract_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    terms: Optional[str] = None
    is_active: Optional[bool] = None

class ContractInDBBase(ContractBase):
    id: int

    class Config:
        orm_mode = True

class Contract(ContractInDBBase):
    property: PropertySummary
    vendor: VendorSummary

    class Config:
        orm_mode = True
