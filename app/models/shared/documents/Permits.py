# models/shared/documents/Permits.py

from pydantic import BaseModel
from datetime import date
from typing import Optional

class Permit(BaseModel):
    id: int
    permit_type: str  # E.g., 'Building', 'Zoning'
    issue_date: date
    expiration_date: Optional[date] = None
    status: str  # 'Pending', 'Approved', 'Expired'

    def is_valid(self) -> bool:
        today = date.today()
        return self.status == 'Approved' and (self.expiration_date is None or today <= self.expiration_date)
