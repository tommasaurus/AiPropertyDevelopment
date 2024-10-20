# app/schemas/expense.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.property_summary import PropertySummary
from app.schemas.vendor_summary import VendorSummary
from app.schemas.document_summary import DocumentSummary

class ExpenseBase(BaseModel):
    property_id: int
    vendor_id: Optional[int] = None
    category: str
    amount: float
    date_incurred: date
    description: Optional[str] = None
    receipt_url: Optional[str] = None
    is_recurring: Optional[bool] = False
    frequency: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    property_id: Optional[int] = None
    vendor_id: Optional[int] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    date_incurred: Optional[date] = None
    description: Optional[str] = None
    receipt_url: Optional[str] = None
    is_recurring: Optional[bool] = None
    frequency: Optional[str] = None

class ExpenseInDBBase(ExpenseBase):
    id: int

    class Config:
        orm_mode = True

class Expense(ExpenseInDBBase):
    property: PropertySummary
    vendor: Optional[VendorSummary] = None
    documents: Optional[List[DocumentSummary]] = []

    class Config:
        orm_mode = True
