# models/expansion/ExpansionTimeline.py

from models.shared.BaseTimeline import BaseTimeline

class ExpansionTimeline(BaseTimeline):
    def add_expansion_milestone(self, milestone):
        # Additional logic for expansion milestones
        self.add_milestone(milestone)
