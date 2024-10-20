# app/api/endpoints/property.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Property)
async def create_property(
    property_in: schemas.PropertyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_property.create_property(db=db, property_in=property_in)

@router.get("/", response_model=List[schemas.Property])
async def read_properties(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    properties = await crud.crud_property.get_properties(db=db, skip=skip, limit=limit)
    return properties

@router.get("/{property_id}", response_model=schemas.Property)
async def read_property(
    property_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = await crud.crud_property.get_property(db=db, property_id=property_id)
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.put("/{property_id}", response_model=schemas.Property)
async def update_property(
    property_id: int,
    property_in: schemas.PropertyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = await crud.crud_property.get_property(db=db, property_id=property_id)
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return await crud.crud_property.update_property(db=db, property=property, property_in=property_in)

@router.delete("/{property_id}", response_model=schemas.Property)
async def delete_property(
    property_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = await crud.crud_property.delete_property(db=db, property_id=property_id)
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property
