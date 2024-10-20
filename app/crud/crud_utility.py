# app/crud/crud_utility.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.utility import Utility
from app.schemas.utility import UtilityCreate, UtilityUpdate

def get_utility(db: Session, utility_id: int) -> Optional[Utility]:
    return db.query(Utility).filter(Utility.id == utility_id).first()

def get_utilities(db: Session, skip: int = 0, limit: int = 100) -> List[Utility]:
    return db.query(Utility).offset(skip).limit(limit).all()

def create_utility(db: Session, utility_in: UtilityCreate) -> Utility:
    db_utility = Utility(**utility_in.dict())
    db.add(db_utility)
    db.commit()
    db.refresh(db_utility)
    return db_utility

def update_utility(db: Session, db_utility: Utility, utility_in: UtilityUpdate) -> Utility:
    update_data = utility_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_utility, key, value)
    db.commit()
    db.refresh(db_utility)
    return db_utility

def delete_utility(db: Session, utility_id: int):
    db_utility = get_utility(db, utility_id)
    if db_utility:
        db.delete(db_utility)
        db.commit()
    return db_utility
