# models/new_construction/ConstructionBudget.py

from models.shared.financials.Budget import Budget

class ConstructionBudget(Budget):
    construction_specific_costs: float = 0.0

    def allocate_construction_costs(self, amount: float):
        self.construction_specific_costs += amount
        self.allocate_budget(amount)
