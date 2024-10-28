# app/schemas/invoice_summary.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class InvoiceSummary(BaseModel):
    id: int
    invoice_number: Optional[str] = None
    amount: float
    invoice_date: Optional[date] = None
    status: str

    class Config:
        from_attributes = True
