from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    aegis_code: str
    full_name: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "vivek@aegishub.com",
                "aegis_code": "<REDACTED_AEGIS_CODE>",
                "full_name": "Vivek Kumar",
                "password": "<REDACTED_PASSWORD>"
            }
        }

class UserLogin(BaseModel):
    aegis_code: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "aegis_code": "<REDACTED_AEGIS_CODE>",
                "password": "<REDACTED_PASSWORD>"
            }
        }

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    user_id: Optional[str] = None
    aegis_code: Optional[str] = None
