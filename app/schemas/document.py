# app/schemas/document.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    document_type: str
    file_url: str
    upload_date: Optional[datetime] = None
    description: Optional[str] = None
    property_id: Optional[int] = None
    tenant_id: Optional[int] = None
    lease_id: Optional[int] = None
    expense_id: Optional[int] = None
    invoice_id: Optional[int] = None
    contract_id: Optional[int] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    document_type: Optional[str] = None
    file_url: Optional[str] = None
    description: Optional[str] = None

class DocumentInDBBase(DocumentBase):
    id: int

    class Config:
        orm_mode = True

class Document(DocumentInDBBase):
    pass
