# app/services/lease_processor.py

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app import schemas, crud
from app.services.document_processor import extract_text_from_file
from app.services.openai.openai_document import OpenAIService
from app.services.mapping_functions import parse_json, map_lease_data
from io import BytesIO
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

async def process_lease_upload(
    file_content: bytes,
    filename: str,
    property_id: int,
    document_type: str,
    db: AsyncSession,
    owner_id: int
):
    # Extract text from the file
    file_like = BytesIO(file_content)
    text = extract_text_from_file(file_like, filename)
    if not text:
        raise ValueError("Could not extract text from the document.")

    # Initialize OpenAIService
    openai_service = OpenAIService()
    extracted_data = await openai_service.extract_information(text, document_type)

    if not extracted_data:
        raise ValueError("Could not extract information from the document.")

    # Parse and map data
    parsed_data = parse_json(json.dumps(extracted_data))
    mapped_data = map_lease_data(parsed_data)    

    # Extract tenant_info if present
    tenant_info = mapped_data.get('tenant_info', None)        

    # Handle tenant creation or retrieval
    tenant_id = None
    tenant = None
    if tenant_info:
        # Check if tenant already exists based on name and owner_id
        tenant = await crud.crud_tenant.get_tenant_by_name_and_landlord(
            db=db,
            first_name=tenant_info.get('first_name'),
            last_name=tenant_info.get('last_name'),
            landlord=tenant_info.get('landlord'),
            owner_id=owner_id
        )
        if tenant:
            tenant_id = tenant.id
        else:
            # Create a tenant
            tenant_in = schemas.TenantCreate(**tenant_info)
            tenant = await crud.crud_tenant.create_tenant(
                db=db,
                tenant_in=tenant_in,
                owner_id=owner_id
            )
            tenant_id = tenant.id

    # Include property_id and tenant_id in mapped_data
    mapped_data['property_id'] = property_id
    mapped_data['tenant_id'] = tenant_id

    # Create LeaseCreate schema
    try:        
        lease_in = schemas.LeaseCreate(**mapped_data)        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating lease data: {str(e)}"
        )

    # Create the lease in the database
    lease_id = None
    try:     
        lease = await crud.crud_lease.create_lease(
            db=db,
            lease_in=lease_in,
            owner_id=owner_id
        )
        lease_id = lease.id
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    logger.info(mapped_data)
    logger.info(tenant_info)

    # Extract lease_type, description if present
    lease_type = mapped_data.get('lease_type', None)  
    description = mapped_data.get('description', None)  

    # Handle document creation or retrieval
    document_id = None    
    document_in = schemas.DocumentCreate(
        property_id=property_id,
        lease_id=lease_id,
        document_type=lease_type,
        description=description
    )    

    document = await crud.crud_document.create_document(
        db=db,
        document_in=document_in,
        owner_id=owner_id
    )

    # Link the lease to the document and tenant
    lease.document = document
    lease.tenant = tenant
    await db.commit()

    # Refresh the lease to ensure all relationships are loaded
    await db.refresh(lease)

    # Map to Pydantic schema before returning
    lease_schema = schemas.Lease.from_orm(lease)
    return lease
