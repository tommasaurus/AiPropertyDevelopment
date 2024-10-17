# models/renovation/RenovationBudget.py

from models.shared.financials.Budget import Budget

class RenovationBudget(Budget):
    renovation_specific_costs: float = 0.0

    def allocate_renovation_costs(self, amount: float):
        self.renovation_specific_costs += amount
        self.allocate_budget(amount)
