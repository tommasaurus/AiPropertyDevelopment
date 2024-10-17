# models/expansion/ExpansionBudget.py

from models.shared.financials.Budget import Budget

class ExpansionBudget(Budget):
    expansion_specific_costs: float = 0.0

    def allocate_expansion_costs(self, amount: float):
        self.expansion_specific_costs += amount
        self.allocate_budget(amount)
