# app/schemas/utility_summary.py

from pydantic import BaseModel

class UtilitySummary(BaseModel):
    id: int
    utility_type: str
    company_name: str

    class Config:
        from_attributes = True
