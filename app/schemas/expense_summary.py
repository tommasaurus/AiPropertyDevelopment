# app/schemas/expense_summary.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class ExpenseSummary(BaseModel):
    id: int
    category: str
    amount: float
    date_incurred: date

    class Config:
        orm_mode = True
