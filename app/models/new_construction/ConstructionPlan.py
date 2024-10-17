# models/new_construction/ConstructionPlan.py

from models.shared.Plan import BasePlan

class ConstructionPlan(BasePlan):
    permit_requirements: str

    def apply_for_permits(self):
        # Logic to apply for construction permits
        pass
