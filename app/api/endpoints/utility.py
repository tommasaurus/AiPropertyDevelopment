# app/api/endpoints/utility.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Utility)
async def create_utility(
    utility_in: schemas.UtilityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_utility.create_utility(db=db, utility_in=utility_in)

@router.get("/", response_model=List[schemas.Utility])
async def read_utilities(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    utilities = await crud.crud_utility.get_utilities(db=db, skip=skip, limit=limit)
    return utilities

@router.get("/{utility_id}", response_model=schemas.Utility)
async def read_utility(
    utility_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    utility = await crud.crud_utility.get_utility(db=db, utility_id=utility_id)
    if utility is None:
        raise HTTPException(status_code=404, detail="Utility not found")
    return utility

@router.put("/{utility_id}", response_model=schemas.Utility)
async def update_utility(
    utility_id: int,
    utility_in: schemas.UtilityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    utility = await crud.crud_utility.get_utility(db=db, utility_id=utility_id)
    if utility is None:
        raise HTTPException(status_code=404, detail="Utility not found")
    return await crud.crud_utility.update_utility(db=db, utility=utility, utility_in=utility_in)

@router.delete("/{utility_id}", response_model=schemas.Utility)
async def delete_utility(
    utility_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    utility = await crud.crud_utility.delete_utility(db=db, utility_id=utility_id)
    if utility is None:
        raise HTTPException(status_code=404, detail="Utility not found")
    return utility
