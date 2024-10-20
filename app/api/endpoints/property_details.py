# app/api/endpoints/property_details.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.PropertyDetails)
async def create_property_details(
    property_details_in: schemas.PropertyDetailsCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_property_details.create_property_details(db=db, property_details_in=property_details_in)

@router.get("/", response_model=List[schemas.PropertyDetails])
async def read_property_details(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property_details = await crud.crud_property_details.get_property_details(db=db, skip=skip, limit=limit)
    return property_details

@router.get("/{property_details_id}", response_model=schemas.PropertyDetails)
async def read_property_details_by_id(
    property_details_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property_details = await crud.crud_property_details.get_property_details_by_id(db=db, property_details_id=property_details_id)
    if property_details is None:
        raise HTTPException(status_code=404, detail="PropertyDetails not found")
    return property_details

@router.put("/{property_details_id}", response_model=schemas.PropertyDetails)
async def update_property_details(
    property_details_id: int,
    property_details_in: schemas.PropertyDetailsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property_details = await crud.crud_property_details.get_property_details_by_id(db=db, property_details_id=property_details_id)
    if property_details is None:
        raise HTTPException(status_code=404, detail="PropertyDetails not found")
    return await crud.crud_property_details.update_property_details(db=db, property_details=property_details, property_details_in=property_details_in)

@router.delete("/{property_details_id}", response_model=schemas.PropertyDetails)
async def delete_property_details(
    property_details_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property_details = await crud.crud_property_details.delete_property_details(db=db, property_details_id=property_details_id)
    if property_details is None:
        raise HTTPException(status_code=404, detail="PropertyDetails not found")
    return property_details
