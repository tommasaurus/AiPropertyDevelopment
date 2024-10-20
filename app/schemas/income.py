# app/schemas/income.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class IncomeBase(BaseModel):
    property_id: int
    category: str
    amount: float
    date_received: date
    description: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    date_received: Optional[date] = None
    description: Optional[str] = None

class IncomeInDBBase(IncomeBase):
    id: int

    class Config:
        orm_mode = True

class Income(IncomeInDBBase):
    pass
