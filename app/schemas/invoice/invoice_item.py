# app/schemas/invoice/invoice_item.py

from pydantic import BaseModel
from typing import Optional

class InvoiceItemBase(BaseModel):
    description: str
    quantity: Optional[float] = 1.0
    unit_price: float
    total_price: float

    class Config:
        orm_mode = True

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemUpdate(InvoiceItemBase):
    pass

class InvoiceItem(InvoiceItemBase):
    id: int
    invoice_id: int
