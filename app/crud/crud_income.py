# app/crud/crud_income.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.income import Income
from app.schemas.income import IncomeCreate, IncomeUpdate

def get_income(db: Session, income_id: int) -> Optional[Income]:
    return db.query(Income).filter(Income.id == income_id).first()

def get_incomes(db: Session, skip: int = 0, limit: int = 100) -> List[Income]:
    return db.query(Income).offset(skip).limit(limit).all()

def create_income(db: Session, income_in: IncomeCreate) -> Income:
    db_income = Income(**income_in.dict())
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

def update_income(db: Session, db_income: Income, income_in: IncomeUpdate) -> Income:
    update_data = income_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_income, key, value)
    db.commit()
    db.refresh(db_income)
    return db_income

def delete_income(db: Session, income_id: int):
    db_income = get_income(db, income_id)
    if db_income:
        db.delete(db_income)
        db.commit()
    return db_income
