# app/api/endpoints/property.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

# Create a new property
@router.post("/", response_model=schemas.Property)
async def create_property(
    property_in: schemas.PropertyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await crud.crud_property.create_with_owner(db=db, obj_in=property_in, owner_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# Get all properties for the current user
@router.get("/", response_model=List[schemas.Property])
async def read_properties(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_property.get_properties_by_owner(db=db, owner_id=current_user.id, skip=skip, limit=limit)

# Get a single property by id
@router.get("/{property_id}", response_model=schemas.Property)
async def read_property(
    property_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = await crud.crud_property.get_property_by_owner(db=db, property_id=property_id, owner_id=current_user.id)
    if property is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found or access denied")
    return property

# Update a property
@router.put("/{property_id}", response_model=schemas.Property)
async def update_property(
    property_id: int,
    property_in: schemas.PropertyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = await crud.crud_property.get_property_by_owner(db=db, property_id=property_id, owner_id=current_user.id)
    if property is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found or access denied")
    try:
        return await crud.crud_property.update_property(db=db, property=property, property_in=property_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# Delete a property
@router.delete("/{property_id}", response_model=schemas.Property)
async def delete_property(
    property_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = await crud.crud_property.get_property_by_owner(db=db, property_id=property_id, owner_id=current_user.id)
    if property is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found or access denied")
    try:
        return await crud.crud_property.delete_property(db=db, property=property)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
