# models/shared/financials/Financials.py

from pydantic import BaseModel
from typing import List
from models.shared.financials.MaterialCosts import MaterialCost
from models.shared.financials.LaborCosts import LaborCost

class Financials(BaseModel):
    budget: float
    material_costs: List[MaterialCost] = []
    labor_costs: List[LaborCost] = []

    def add_material_cost(self, material_cost: MaterialCost):
        self.material_costs.append(material_cost)

    def add_labor_cost(self, labor_cost: LaborCost):
        self.labor_costs.append(labor_cost)

    def total_expenses(self) -> float:
        total_materials = sum(mc.total_cost for mc in self.material_costs)
        total_labor = sum(lc.total_cost for lc in self.labor_costs)
        return total_materials + total_labor

    def remaining_budget(self) -> float:
        return self.budget - self.total_expenses()
