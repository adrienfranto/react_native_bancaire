from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    nom: str
    email: str

class UserCreate(UserBase):
    password: str
    photo_profil_url: Optional[str] = None

class UserUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[str] = None
    photo_profil_url: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    photo_profil_url: Optional[str] = None

    class Config:
        from_attributes = True
