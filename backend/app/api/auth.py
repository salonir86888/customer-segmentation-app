from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.services.auth_service import register_user, authenticate_user, get_user_by_email

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Store Operations Lead"
    store_name: Optional[str] = "Local Retail POS Node"

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    role_badge: str
    avatar: Optional[str] = None
    store_name: Optional[str] = None

@router.post("/signup", response_model=UserResponse)
def signup(req: SignupRequest):
    try:
        user = register_user(
            name=req.name,
            email=req.email,
            password=req.password,
            role=req.role or "Store Operations Lead",
            store_name=req.store_name or "Local Retail POS Node"
        )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=UserResponse)
def login(req: LoginRequest):
    user, error_msg = authenticate_user(req.email, req.password)
    if error_msg:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_msg
        )
    return user

@router.get("/user/{email}", response_model=UserResponse)
def get_profile(email: str):
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "role_badge": user["role_badge"],
        "avatar": user["avatar"],
        "store_name": user["store_name"]
    }
