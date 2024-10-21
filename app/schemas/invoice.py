# app/schemas/invoice.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.property_summary import PropertySummary
from app.schemas.vendor_summary import VendorSummary
from app.schemas.document_summary import DocumentSummary

class InvoiceBase(BaseModel):
    property_id: int
    vendor_id: int
    invoice_number: Optional[str] = None
    amount: float
    invoice_date: date
    due_date: Optional[date] = None
    status: Optional[str] = 'Unpaid'
    description: Optional[str] = None
    document_url: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    amount: Optional[float] = None
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    description: Optional[str] = None
    document_url: Optional[str] = None

class InvoiceInDBBase(InvoiceBase):
    id: int

    class Config:
        orm_mode = True

class Invoice(InvoiceInDBBase):
    property: PropertySummary
    vendor: VendorSummary
    documents: Optional[List[DocumentSummary]] = []

    class Config:
        orm_mode = True
