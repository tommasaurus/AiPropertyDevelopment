# models/shared/financials/Budget.py

from pydantic import BaseModel

class Budget(BaseModel):
    total_budget: float
    allocated_budget: float = 0.0

    def allocate_budget(self, amount: float):
        self.allocated_budget += amount

    def remaining_budget(self) -> float:
        return self.total_budget - self.allocated_budget
