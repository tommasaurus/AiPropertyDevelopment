# models/shared/BaseTimeline.py

from pydantic import BaseModel
from typing import List
from datetime import date

class Milestone(BaseModel):
    name: str
    due_date: date
    completed: bool = False

class BaseTimeline(BaseModel):
    milestones: List[Milestone] = []

    def add_milestone(self, milestone: Milestone):
        self.milestones.append(milestone)

    def get_upcoming_milestones(self) -> List[Milestone]:
        today = date.today()
        return [m for m in self.milestones if not m.completed and m.due_date >= today]
