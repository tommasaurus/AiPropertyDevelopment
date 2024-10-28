# app/api/endpoints/property_details.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
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
    try:
        property_details = await crud.crud_property_details.create_property_details(db=db, details_in=property_details_in, owner_id=current_user.id)
        return property_details
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{property_id}", response_model=schemas.PropertyDetails)
async def read_property_details(
    property_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property_details = await crud.crud_property_details.get_property_details(db=db, property_id=property_id, owner_id=current_user.id)
    if property_details is None:
        raise HTTPException(status_code=404, detail="Property details not found")
    return property_details

@router.put("/{property_id}", response_model=schemas.PropertyDetails)
async def update_property_details(
    property_id: int,
    property_details_in: schemas.PropertyDetailsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property_details = await crud.crud_property_details.get_property_details(db=db, property_id=property_id, owner_id=current_user.id)
    if property_details is None:
        raise HTTPException(status_code=404, detail="Property details not found")
    try:
        updated_details = await crud.crud_property_details.update_property_details(db=db, db_details=property_details, details_in=property_details_in)
        return updated_details
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
