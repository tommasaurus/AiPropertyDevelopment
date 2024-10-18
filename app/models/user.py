# /app/models/user.py
from sqlalchemy import Column, Integer, String
from app.db.database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, index=True, nullable=True)  # Nullable for non-OAuth users
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)  # Nullable in case name is not provided
    profile_pic = Column(String, nullable=True)  # Optional field
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
