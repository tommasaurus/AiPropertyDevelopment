# app/crud/crud_property.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyUpdate
from sqlalchemy.exc import IntegrityError

async def create_with_owner(db: AsyncSession, obj_in: PropertyCreate, owner_id: int) -> Property:
    # Check if the property already exists for the same user (address + owner_id combination)
    existing_property = await db.execute(
        select(Property)
        .filter(Property.address == obj_in.address)
        .filter(Property.owner_id == owner_id)
    )
    existing_property = existing_property.scalars().first()

    if existing_property:
        raise ValueError("Property with this address already exists for the current user")

    # Proceed to create the property if no duplicates exist
    db_obj = Property(**obj_in.dict(), owner_id=owner_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

# Retrieve multiple properties by the owner's id
async def get_properties_by_owner(db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[Property]:
    result = await db.execute(
        select(Property).filter(Property.owner_id == owner_id).offset(skip).limit(limit)
    )
    return result.scalars().all()

# Get a single property by its id
async def get_property_by_owner(db: AsyncSession, property_id: int, owner_id: int) -> Property:
    result = await db.execute(
        select(Property)
        .filter(Property.id == property_id)
        .filter(Property.owner_id == owner_id)
    )
    return result.scalars().first()

# Update a property
async def update_property(db: AsyncSession, property: Property, property_in: PropertyUpdate) -> Property:
    for key, value in property_in.dict(exclude_unset=True).items():
        setattr(property, key, value)
    await db.commit()
    await db.refresh(property)
    return property

# Delete a property
async def delete_property(db: AsyncSession, property_id: int) -> Property:
    property = await get_property_by_owner(db=db, property_id=property_id)
    await db.delete(property)
    await db.commit()
    return property
