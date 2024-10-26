# app/api/endpoints/lease.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.document_processor import extract_text_from_file
from app.services.openai.openai_document import OpenAIService
from app.services.mapping_functions import parse_json, map_lease_data
from io import BytesIO

router = APIRouter()

@router.post("/upload", response_model=schemas.Lease)
async def upload_lease(
    property_id: int,
    document_type: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify that the property exists and belongs to the owner
    property = await crud.crud_property.get_property(db=db, property_id=property_id)
    if not property or property.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or you do not have access to this property."
        )

    # Read the file content
    file_content = await file.read()
    file_like = BytesIO(file_content)

    # Extract text from the file
    text = extract_text_from_file(file_like, file.filename)
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from the document."
        )

    # Initialize OpenAIService
    openai_service = OpenAIService()
    extracted_data = await openai_service.extract_information(text, document_type)

    if not extracted_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract information from the document."
        )

    # Parse and map data
    parsed_data = parse_json(extracted_data)
    mapped_data = map_lease_data(parsed_data)

    # Include property_id in mapped_data
    mapped_data['property_id'] = property_id

    # Create LeaseCreate schema
    lease_in = schemas.LeaseCreate(**mapped_data)

    # Create the lease in the database
    try:
        lease = await crud.crud_lease.create_lease(
            db=db,
            lease_in=lease_in,
            owner_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return lease

@router.post("/", response_model=schemas.Lease)
async def create_lease(
    lease_in: schemas.LeaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the property belongs to the current user
    property = await crud.crud_property.get_property(db=db, property_id=lease_in.property_id)
    if not property or property.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="You do not own this property.")
    return await crud.crud_lease.create_lease(db=db, lease_in=lease_in, owner_id=current_user.id)

@router.get("/", response_model=List[schemas.Lease])
async def read_leases(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leases = await crud.crud_lease.get_leases(db=db, owner_id=current_user.id, skip=skip, limit=limit)
    return leases

@router.get("/{lease_id}", response_model=schemas.Lease)
async def read_lease(
    lease_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lease = await crud.crud_lease.get_lease(db=db, lease_id=lease_id, owner_id=current_user.id)
    if lease is None:
        raise HTTPException(status_code=404, detail="Lease not found")
    return lease

@router.put("/{lease_id}", response_model=schemas.Lease)
async def update_lease(
    lease_id: int,
    lease_in: schemas.LeaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lease = await crud.crud_lease.get_lease(db=db, lease_id=lease_id, owner_id=current_user.id)
    if lease is None:
        raise HTTPException(status_code=404, detail="Lease not found")
    return await crud.crud_lease.update_lease(db=db, lease=lease, lease_in=lease_in)

@router.delete("/{lease_id}", response_model=schemas.Lease)
async def delete_lease(
    lease_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        lease = await crud.crud_lease.delete_lease(db=db, lease_id=lease_id, owner_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return lease
