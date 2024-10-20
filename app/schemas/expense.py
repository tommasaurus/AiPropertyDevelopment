# app/schemas/expense.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

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
    pass
