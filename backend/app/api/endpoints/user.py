from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserUpdate, UserLogin

router = APIRouter()

UPLOAD_DIR = "uploads/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/register", response_model=UserOut, tags=["auth"])
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    new_user = User(
        nom=user.nom,
        email=user.email,
        password=user.password,
        photo_profil_url=user.photo_profil_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=UserOut, tags=["auth"])
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == credentials.email).first()
    if not db_user or db_user.password != credentials.password:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    return db_user

@router.get("/", response_model=List[UserOut])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/{user_id}/upload-profile-image", response_model=UserOut)
async def upload_profile_image(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate a unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update user photo URL
    # Relative path accessible through StaticFiles
    db_user.photo_profil_url = f"/static/images/{filename}"
    db.commit()
    db.refresh(db_user)

    return db_user
