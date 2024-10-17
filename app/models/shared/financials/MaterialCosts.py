# models/shared/financials/MaterialCosts.py

from pydantic import BaseModel
from datetime import date
from typing import Optional

class MaterialCost(BaseModel):
    id: int
    material_name: str
    quantity: float
    unit_cost: float
    total_cost: float = 0.0
    date_purchased: date
    supplier: Optional[str] = None

    def calculate_total_cost(self):
        self.total_cost = self.quantity * self.unit_cost
