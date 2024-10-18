# /app/services/auth/auth_service.py
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from .utils import verify_password, get_password_hash
from .jwt import create_access_token, create_refresh_token, decode_refresh_token
from app.models.user import User

# Signup service
async def signup_user(db: AsyncSession, email: str, password: str):
    # Normalize the email
    normalized_email = email.strip().lower()

    # Check if the email already exists
    stmt = select(User).filter(User.email == normalized_email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if user:
        if user.hashed_password is None:
            # The email is registered via OAuth
            raise HTTPException(
                status_code=400,
                detail="Email is associated with a social account. Please log in using that method."
            )
        else:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the user's password and create a new user
    hashed_password = get_password_hash(password)
    new_user = User(email=normalized_email, hashed_password=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"msg": "User created successfully"}

# Login service
async def login_user(db: AsyncSession, email: str, password: str):
    # Normalize the email
    normalized_email = email.strip().lower()

    # Check if the user exists in the database
    stmt = select(User).filter(User.email == normalized_email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if user.hashed_password is None:
        # The account is registered via OAuth
        raise HTTPException(
            status_code=400,
            detail="This account is registered via social login. Please log in using that method."
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Create both access and refresh tokens
    access_token = create_access_token(data={"sub": normalized_email})
    refresh_token = create_refresh_token(data={"sub": normalized_email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# Service to refresh access token
async def refresh_access_token(refresh_token: str):
    email = decode_refresh_token(refresh_token)
    new_access_token = create_access_token(data={"sub": email})
    return {"access_token": new_access_token, "token_type": "bearer"}
