# app/crud/crud_property.py

from sqlalchemy.orm import Session
from typing import List
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyUpdate

def create_with_owner(db: Session, obj_in: PropertyCreate, owner_id: int) -> Property:
    db_obj = Property(**obj_in.dict(), owner_id=owner_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_multi_by_owner(db: Session, owner_id: int) -> List[Property]:
    return db.query(Property).filter(Property.owner_id == owner_id).all()
