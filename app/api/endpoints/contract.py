# app/api/endpoints/contract.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Contract)
async def create_contract(
    contract_in: schemas.ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_contract.create_contract(db=db, contract_in=contract_in)

@router.get("/", response_model=List[schemas.Contract])
async def read_contracts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contracts = await crud.crud_contract.get_contracts(db=db, skip=skip, limit=limit)
    return contracts

@router.get("/{contract_id}", response_model=schemas.Contract)
async def read_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contract = await crud.crud_contract.get_contract(db=db, contract_id=contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@router.put("/{contract_id}", response_model=schemas.Contract)
async def update_contract(
    contract_id: int,
    contract_in: schemas.ContractUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contract = await crud.crud_contract.get_contract(db=db, contract_id=contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail="Contract not found")
    return await crud.crud_contract.update_contract(db=db, contract=contract, contract_in=contract_in)

@router.delete("/{contract_id}", response_model=schemas.Contract)
async def delete_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contract = await crud.crud_contract.delete_contract(db=db, contract_id=contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract
