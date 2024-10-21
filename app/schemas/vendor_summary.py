# app/schemas/vendor_summary.py

from pydantic import BaseModel

class VendorSummary(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
