# app/models/project_documentation.py

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..database import Base

class ProjectDocumentation(Base):
    __tablename__ = "project_documentations"

    id = Column(Integer, primary_key=True, index=True)
    documentation_type = Column(String, nullable=False)  # e.g., Proposal, Contract
    title = Column(String)
    description = Column(String)
    document_url = Column(String)
    date_created = Column(Date)
    date_modified = Column(Date)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="project_documentations")
