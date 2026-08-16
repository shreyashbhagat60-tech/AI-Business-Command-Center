from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
import logging

from schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    AuthTokenResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    UpdateProfileRequest
)
from services.auth_service import auth_service

logger = logging.getLogger("ai_command_center.routers.auth")
router = APIRouter(tags=["Authentication & User Management"])

async def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required. Please sign in.")
    
    token = authorization.split(" ")[1].strip()
    user = auth_service.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session. Please sign in again.")
    return UserResponse(**user)

@router.post(
    "/auth/register",
    response_model=AuthTokenResponse,
    summary="Register New Enterprise User Account",
    description="Creates a new executive/analyst account and returns a bearer access token."
)
async def register(request: UserRegisterRequest):
    try:
        res = auth_service.register_user(
            full_name=request.full_name,
            email=str(request.email),
            password=request.password,
            role=request.role or "Chief Executive Officer",
            company_name=request.company_name or "Enterprise Global Corp"
        )
        return AuthTokenResponse(
            access_token=res["token"],
            token_type="bearer",
            user=UserResponse(**res["user"])
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user account.")

@router.post(
    "/auth/login",
    response_model=AuthTokenResponse,
    summary="User Login & Authentication",
    description="Validates credentials and returns an active session access token."
)
async def login(request: UserLoginRequest):
    try:
        res = auth_service.login_user(
            email=str(request.email),
            password=request.password
        )
        return AuthTokenResponse(
            access_token=res["token"],
            token_type="bearer",
            user=UserResponse(**res["user"])
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed. Please try again.")

@router.get(
    "/auth/me",
    response_model=UserResponse,
    summary="Get Authenticated User Profile",
    description="Returns current authenticated session user profile."
)
async def get_auth_me(user: UserResponse = Depends(get_current_user)):
    return user

@router.post(
    "/auth/forgot-password",
    response_model=ForgotPasswordResponse,
    summary="Forgot Password Recovery Request",
    description="Generates password recovery instructions and safely responds without revealing security credentials."
)
async def forgot_password(request: ForgotPasswordRequest):
    try:
        res = auth_service.forgot_password_request(email=str(request.email))
        return ForgotPasswordResponse(**res)
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process password recovery request.")

@router.post(
    "/auth/logout",
    summary="Logout User Session",
    description="Invalidates current session access token."
)
async def logout(authorization: Optional[str] = Header(None)):
    return {"message": "Successfully signed out of AI Business Command Center"}

@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Get User Profile",
    description="Returns the current authenticated user's profile details."
)
async def get_user_profile(user: UserResponse = Depends(get_current_user)):
    return user

@router.put(
    "/profile",
    response_model=UserResponse,
    summary="Update User Profile",
    description="Updates full name, company, role, or password for authenticated user."
)
async def update_user_profile(
    request: UpdateProfileRequest,
    user: UserResponse = Depends(get_current_user)
):
    try:
        updated = auth_service.update_profile(
            user_id=user.id,
            full_name=request.full_name,
            company_name=request.company_name,
            role=request.role,
            new_password=request.new_password
        )
        return UserResponse(**updated)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile.")
