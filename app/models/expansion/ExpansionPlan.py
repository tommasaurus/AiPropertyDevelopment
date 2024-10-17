# models/expansion/ExpansionPlan.py

from models.shared.Plan import BasePlan

class ExpansionPlan(BasePlan):
    zoning_requirements: str

    def check_zoning_compliance(self):
        # Logic to verify zoning compliance
        pass
