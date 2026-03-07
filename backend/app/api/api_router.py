from fastapi import APIRouter
from app.api.endpoints import pret, user

api_router = APIRouter()
api_router.include_router(pret.router, prefix="/prets", tags=["prets"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
