# app/schemas/document.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.property_summary import PropertySummary
from app.schemas.tenant_summary import TenantSummary
from app.schemas.lease_summary import LeaseSummary
from app.schemas.expense_summary import ExpenseSummary
from app.schemas.invoice_summary import InvoiceSummary
from app.schemas.contract_summary import ContractSummary

class DocumentBase(BaseModel):
    property_id: Optional[int] = None
    tenant_id: Optional[int] = None
    lease_id: Optional[int] = None
    expense_id: Optional[int] = None
    invoice_id: Optional[int] = None
    contract_id: Optional[int] = None
    document_type: str
    file_url: str
    description: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    property_id: Optional[int] = None
    tenant_id: Optional[int] = None
    lease_id: Optional[int] = None
    expense_id: Optional[int] = None
    invoice_id: Optional[int] = None
    contract_id: Optional[int] = None
    document_type: Optional[str] = None
    file_url: Optional[str] = None
    description: Optional[str] = None

class DocumentInDBBase(DocumentBase):
    id: int
    upload_date: datetime

    class Config:
        orm_mode = True

class Document(DocumentInDBBase):
    property: Optional[PropertySummary] = None
    tenant: Optional[TenantSummary] = None
    lease: Optional[LeaseSummary] = None
    expense: Optional[ExpenseSummary] = None
    invoice: Optional[InvoiceSummary] = None
    contract: Optional[ContractSummary] = None

    class Config:
        orm_mode = True
