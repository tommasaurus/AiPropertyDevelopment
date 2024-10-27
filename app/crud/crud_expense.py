# app/crud/crud_expense.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

class CRUDExpense:
    async def get_expense(self, db: AsyncSession, expense_id: int) -> Optional[Expense]:
        result = await db.execute(select(Expense).filter(Expense.id == expense_id))
        return result.scalars().first()

    async def get_expenses(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Expense]:
        result = await db.execute(select(Expense).offset(skip).limit(limit))
        return result.scalars().all()

    async def create_expense(self, db: AsyncSession, expense_in: ExpenseCreate) -> Expense:
        db_expense = Expense(**expense_in.dict())
        db.add(db_expense)
        await db.commit()
        await db.refresh(db_expense)
        return db_expense

    async def update_expense(self, db: AsyncSession, db_expense: Expense, expense_in: ExpenseUpdate) -> Expense:
        update_data = expense_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_expense, key, value)
        await db.commit()
        await db.refresh(db_expense)
        return db_expense

    async def delete_expense(self, db: AsyncSession, expense_id: int):
        db_expense = await self.get_expense(db, expense_id)
        if db_expense:
            await db.delete(db_expense)
            await db.commit()
        return db_expense

# Initialize the CRUD object
crud_expense = CRUDExpense()
