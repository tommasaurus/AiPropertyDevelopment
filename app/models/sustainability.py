# app/models/sustainability.py

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base

class Sustainability(Base):
    __tablename__ = "sustainability"

    id = Column(Integer, primary_key=True, index=True)
    energy_efficiency_measures = Column(String)  # e.g., LED Lighting, Solar Panels
    sustainability_initiatives = Column(String)  # e.g., Recycling Programs
    energy_consumption = Column(Float)  # e.g., kWh per month
    carbon_footprint = Column(Float)  # e.g., tons CO2
    green_certifications = Column(String)  # e.g., LEED, ENERGY STAR
    waste_management = Column(String)  # e.g., Composting Systems
    funding_incentives = Column(String)  # e.g., Grants, Rebates

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="sustainability")
