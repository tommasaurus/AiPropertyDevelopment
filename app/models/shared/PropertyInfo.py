# models/shared/PropertyInfo.py

from pydantic import BaseModel
from typing import Optional

class PropertyInfo(BaseModel):
    address: str
    city: str
    state: str
    zip_code: str
    lot_size: Optional[float] = None  # In square feet or acres
    zoning_classification: Optional[str] = None
