# app/schemas/income.py

from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.schemas.property_summary import PropertySummary

class IncomeBase(BaseModel):
    property_id: int
    category: str
    amount: float
    date_received: date
    description: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeUpdate(BaseModel):
    property_id: Optional[int] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    date_received: Optional[date] = None
    description: Optional[str] = None

class IncomeInDBBase(IncomeBase):
    id: int

    class Config:
        orm_mode = True

class Income(IncomeInDBBase):
    property: PropertySummary

    class Config:
        orm_mode = True
