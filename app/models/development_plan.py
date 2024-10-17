# app/models/development_plan.py

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..database import Base

class DevelopmentPlan(Base):
    __tablename__ = "development_plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_type = Column(String, nullable=False)  # e.g., Blueprint, 3D Model
    description = Column(String)
    document_url = Column(String)
    creation_date = Column(Date)
    revision_date = Column(Date)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="development_plans")
