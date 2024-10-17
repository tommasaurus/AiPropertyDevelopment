# /services/auth/routes.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from .utils import verify_password
from .jwt import create_access_token

router = APIRouter()

# Models
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Example user data (replace with actual DB lookup)
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": "$2b$12$ZFmJotO8/xyzW8JhJ8Le5O.ew2fUkK/IgUb4/B9u.tdAN2yH4MKCm"  # hashed 'password'
    }
}

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = fake_users_db.get(user.username)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
