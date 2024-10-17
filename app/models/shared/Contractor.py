# models/shared/Contractor.py

from pydantic import BaseModel
from typing import Optional

class Contractor(BaseModel):
    id: int
    name: str
    contact_info: str
    role: Optional[str] = None  # E.g., 'Electrician', 'Plumber'

    def upload_receipt(self, receipt):
        # Logic to upload receipt and update financials
        pass

    def communicate(self, message, property_owner_id):
        # Logic to send a message to the property owner
        pass
