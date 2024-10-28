# app/schemas/tenant_summary.py

from pydantic import BaseModel

class TenantSummary(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True
