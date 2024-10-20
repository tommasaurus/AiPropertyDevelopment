# app/schemas/contract.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class ContractBase(BaseModel):
    property_id: int
    vendor_id: int
    contract_type: str
    start_date: date
    end_date: Optional[date] = None
    terms: Optional[str] = None
    document_url: Optional[str] = None
    is_active: Optional[bool] = True

class ContractCreate(ContractBase):
    pass

class ContractUpdate(BaseModel):
    contract_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    terms: Optional[str] = None
    document_url: Optional[str] = None
    is_active: Optional[bool] = None

class ContractInDBBase(ContractBase):
    id: int

    class Config:
        orm_mode = True

class Contract(ContractInDBBase):
    pass
