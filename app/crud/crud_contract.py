# app/crud/crud_contract.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractUpdate

def get_contract(db: Session, contract_id: int) -> Optional[Contract]:
    return db.query(Contract).filter(Contract.id == contract_id).first()

def get_contracts(db: Session, skip: int = 0, limit: int = 100) -> List[Contract]:
    return db.query(Contract).offset(skip).limit(limit).all()

def create_contract(db: Session, contract_in: ContractCreate) -> Contract:
    db_contract = Contract(**contract_in.dict())
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

def update_contract(db: Session, db_contract: Contract, contract_in: ContractUpdate) -> Contract:
    update_data = contract_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_contract, key, value)
    db.commit()
    db.refresh(db_contract)
    return db_contract

def delete_contract(db: Session, contract_id: int):
    db_contract = get_contract(db, contract_id)
    if db_contract:
        db.delete(db_contract)
        db.commit()
    return db_contract
