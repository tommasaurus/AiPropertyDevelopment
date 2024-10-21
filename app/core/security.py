from fastapi import Request, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.user import User
from app.core.config import settings
from app.core.auth.models import TokenData
from typing import Optional

async def get_current_user(
    request: Request, 
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Retrieve the JWT token from the cookies
        token = request.cookies.get("jwt_token")
        if not token:
            raise credentials_exception

        # Decode the JWT token to get the email
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception

        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    # Query the database for the user
    result = await db.execute(select(User).filter(User.email == token_data.email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception

    return user
