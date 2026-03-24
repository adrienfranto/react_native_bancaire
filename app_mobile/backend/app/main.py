from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.api.api_router import api_router
from app.models.pret import PretBancaire
from app.models.user import User

from app.core.database import engine, Base, SessionLocal

# Create tables
Base.metadata.create_all(bind=engine)

def seed_test_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            new_user = User(nom="Adrien Dupont", email="adrien.dupont@finance.fr")
            db.add(new_user)
            db.commit()
    finally:
        db.close()

seed_test_user()

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# Ensure upload directory exists before mounting
os.makedirs("uploads/images", exist_ok=True)
app.mount("/static/images", StaticFiles(directory="uploads/images"), name="images")
