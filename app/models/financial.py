from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class FinancialInfo(Base):
    __tablename__ = "financial_infos"

    id = Column(Integer, primary_key=True, index=True)
    market_value = Column(Float)
    assessed_value = Column(Float)
    mortgage_details = Column(String)
    equity_investments = Column(Float)
    rental_income = Column(Float)
    operating_expenses = Column(Float)
    capital_expenditures = Column(Float)
    
    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="financial_info")
