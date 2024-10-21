# app/schemas/vendor.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.schemas.expense_summary import ExpenseSummary
from app.schemas.invoice_summary import InvoiceSummary
from app.schemas.contract_summary import ContractSummary

class VendorBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    services_provided: Optional[str] = None
    notes: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    services_provided: Optional[str] = None
    notes: Optional[str] = None

class VendorInDBBase(VendorBase):
    id: int

    class Config:
        orm_mode = True

class Vendor(VendorInDBBase):
    expenses: Optional[List[ExpenseSummary]] = []
    invoices: Optional[List[InvoiceSummary]] = []
    contracts: Optional[List[ContractSummary]] = []

    class Config:
        orm_mode = True
