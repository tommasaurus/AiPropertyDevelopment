# app/core/auth/routes.py

from fastapi import APIRouter, Depends, status, HTTPException
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from .models import UserCreate, UserLogin, Token
from app.models.user import User
from .auth_service import signup_user, login_user
from .oauth import oauth
from .oauth_service import authenticate_oauth_user
from app.config import settings
from jose import jwt
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Signup route
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await signup_user(db, user.email, user.password)

# Login route
@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    return await login_user(db, user.email, user.password)

# OAuth login route for Google
@router.get("/login/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("auth_callback")  # Updated endpoint name
    logger.info(f"Generated redirect_uri: {redirect_uri}")
    print(f"Generated redirect_uri: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, redirect_uri)

# OAuth callback route
@router.get("/callback", name="auth_callback")  # Renamed route and added name
async def auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        # Retrieve the token from the OAuth flow
        token = await oauth.google.authorize_access_token(request)

        # Use the service function to authenticate the user
        jwt_token = await authenticate_oauth_user(db, token)

        # Return a response or redirect with the JWT token
        response = RedirectResponse(url="/")  # Update URL as needed
        response.set_cookie("Authorization", f"Bearer {jwt_token}", httponly=True, secure=True)
        return response

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        print(f"Error during Google OAuth: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")
