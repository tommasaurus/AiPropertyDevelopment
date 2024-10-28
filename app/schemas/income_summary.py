# app/schemas/income_summary.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class IncomeSummary(BaseModel):
    id: int
    category: str
    amount: float
    date_received: date

    class Config:
        from_attributes = True
