# models/shared/financials/LaborCosts.py

from pydantic import BaseModel
from datetime import date

class LaborCost(BaseModel):
    id: int
    contractor_id: int
    hours_worked: float
    hourly_rate: float
    total_cost: float = 0.0
    date_recorded: date

    def calculate_total_cost(self):
        self.total_cost = self.hours_worked * self.hourly_rate
