# models/renovation/RenovationPlan.py

from models.shared.Plan import BasePlan

class RenovationPlan(BasePlan):
    material_requirements: str

    def list_required_materials(self):
        # Logic to list materials needed
        pass
