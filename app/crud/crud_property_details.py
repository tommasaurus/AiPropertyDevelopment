# app/crud/crud_property_details.py

from sqlalchemy.orm import Session
from typing import Optional
from app.models.property_details import PropertyDetails
from app.schemas.property_details import PropertyDetailsCreate, PropertyDetailsUpdate

def get_property_details(db: Session, property_id: int) -> Optional[PropertyDetails]:
    return db.query(PropertyDetails).filter(PropertyDetails.property_id == property_id).first()

def create_property_details(db: Session, details_in: PropertyDetailsCreate) -> PropertyDetails:
    db_details = PropertyDetails(**details_in.dict())
    db.add(db_details)
    db.commit()
    db.refresh(db_details)
    return db_details

def update_property_details(db: Session, db_details: PropertyDetails, details_in: PropertyDetailsUpdate) -> PropertyDetails:
    update_data = details_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_details, key, value)
    db.commit()
    db.refresh(db_details)
    return db_details