# models/shared/documents/Legal.py

from pydantic import BaseModel
from typing import List
from datetime import date

class LegalDocument(BaseModel):
    id: int
    document_type: str  # E.g., 'Zoning Agreement'
    date_issued: date
    parties_involved: List[str]
    content: str  # Document content or file reference

    def review(self):
        # Logic to review the document
        pass
