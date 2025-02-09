# app/schemas/invoice/invoice_item.py

from pydantic import BaseModel, ConfigDict
from typing import Optional

class InvoiceItemBase(BaseModel):
    description: str
    quantity: Optional[float] = 1.0
    unit_price: float = 0.0
    total_price: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemUpdate(InvoiceItemBase):
    pass

class InvoiceItem(InvoiceItemBase):
    id: int
    invoice_id: int
