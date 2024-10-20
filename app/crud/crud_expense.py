# app/crud/crud_expense.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

def get_expense(db: Session, expense_id: int) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id).first()

def get_expenses(db: Session, skip: int = 0, limit: int = 100) -> List[Expense]:
    return db.query(Expense).offset(skip).limit(limit).all()

def create_expense(db: Session, expense_in: ExpenseCreate) -> Expense:
    db_expense = Expense(**expense_in.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def update_expense(db: Session, db_expense: Expense, expense_in: ExpenseUpdate) -> Expense:
    update_data = expense_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int):
    db_expense = get_expense(db, expense_id)
    if db_expense:
        db.delete(db_expense)
        db.commit()
    return db_expense
