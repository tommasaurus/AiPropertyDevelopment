# app/api/endpoints/document.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
import aiofiles
import os
from uuid import uuid4

router = APIRouter()

# Directory to save uploaded files
UPLOAD_DIRECTORY = "uploads/documents/"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/", response_model=schemas.Document)
async def create_document(
    document_in: schemas.DocumentCreate,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Save the uploaded file
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid4().hex}{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()  # async read
        await out_file.write(content)  # async write
    
    # Update the document_in with the file URL/path
    document_in.file_url = file_path
    
    return await crud.crud_document.create_document(db=db, document_in=document_in)

@router.get("/", response_model=List[schemas.Document])
async def read_documents(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = await crud.crud_document.get_documents(db=db, skip=skip, limit=limit)
    return documents

@router.get("/{document_id}", response_model=schemas.Document)
async def read_document(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = await crud.crud_document.get_document(db=db, document_id=document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.put("/{document_id}", response_model=schemas.Document)
async def update_document(
    document_id: int,
    document_in: schemas.DocumentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = await crud.crud_document.get_document(db=db, document_id=document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return await crud.crud_document.update_document(db=db, document=document, document_in=document_in)

@router.delete("/{document_id}", response_model=schemas.Document)
async def delete_document(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = await crud.crud_document.delete_document(db=db, document_id=document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    # Optionally, delete the file from the filesystem
    if os.path.exists(document.file_url):
        os.remove(document.file_url)
    return document
