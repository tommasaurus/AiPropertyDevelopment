# models/shared/documents/Contracts.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class Contract(BaseModel):
    id: int
    parties_involved: List[str]
    date_issued: date
    date_expiration: Optional[date] = None
    terms: str  # Contract terms

    def is_active(self) -> bool:
        today = date.today()
        if self.date_expiration:
            return self.date_issued <= today <= self.date_expiration
        return self.date_issued <= today
