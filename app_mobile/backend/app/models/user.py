from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Stored as plain text (no hashing for simplicity)
    photo_profil_url = Column(String, nullable=True)
