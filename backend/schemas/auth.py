from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=80, description="Full Name of the user")
    email: EmailStr = Field(..., description="Corporate or business email address")
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")
    role: Optional[str] = Field(default="Chief Executive Officer", description="Business Role / Title")
    company_name: Optional[str] = Field(default="Enterprise Global Corp", description="Organization name")

class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    company_name: str
    created_at: Optional[str] = None
    is_active: Optional[bool] = True

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address to request password reset")

class ForgotPasswordResponse(BaseModel):
    success: bool = True
    message: str
    email: str
    demo_note: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=80)
    company_name: Optional[str] = Field(None, max_length=120)
    role: Optional[str] = Field(None, max_length=80)
    new_password: Optional[str] = Field(None, min_length=6)
