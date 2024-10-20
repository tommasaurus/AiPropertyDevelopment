# app/schemas/document.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    pass
