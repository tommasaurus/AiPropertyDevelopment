# models/shared/Plan.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class BasePlan(BaseModel):
    project_name: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: float

    def calculate_duration(self) -> Optional[int]:
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days
        return None
