# app/schemas/payment_summary.py

from pydantic import BaseModel
from datetime import date

class PaymentSummary(BaseModel):
    id: int
    amount: float
    payment_date: date
    due_date: date
    status: str

    class Config:
        from_attributes = True
