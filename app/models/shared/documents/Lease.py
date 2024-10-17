# models/shared/documents/Lease.py

from pydantic import BaseModel
from datetime import date

class Lease(BaseModel):
    id: int
    tenant_name: str
    landlord_name: str
    start_date: date
    end_date: date
    rent_amount: float

    def is_current(self) -> bool:
        today = date.today()
        return self.start_date <= today <= self.end_date
