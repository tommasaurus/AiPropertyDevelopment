# models/redevelopment/RedevelopmentBudget.py

from models.shared.financials.Budget import Budget

class RedevelopmentBudget(Budget):
    redevelopment_specific_costs: float = 0.0

    def allocate_redevelopment_costs(self, amount: float):
        self.redevelopment_specific_costs += amount
        self.allocate_budget(amount)
