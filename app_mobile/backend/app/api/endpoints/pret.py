from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.pret import PretBancaire, PretBancaireCreate, PretBancaireUpdate
from app.services.pret_service import pret_service

router = APIRouter()

@router.post("/", response_model=PretBancaire)
def create_pret(
    pret: PretBancaireCreate,
    db: Session = Depends(get_db)
):
    return pret_service.create_pret(db=db, pret=pret)

@router.get("/", response_model=List[PretBancaire])
def read_prets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return pret_service.get_prets(db=db, skip=skip, limit=limit)

@router.put("/{pret_id}", response_model=PretBancaire)
def update_pret(
    pret_id: int,
    pret: PretBancaireUpdate,
    db: Session = Depends(get_db)
):
    db_pret = pret_service.update_pret(db=db, pret_id=pret_id, pret=pret)
    if db_pret is None:
        raise HTTPException(status_code=404, detail="Pret not found")
    return db_pret

@router.delete("/{pret_id}")
def delete_pret(
    pret_id: int,
    db: Session = Depends(get_db)
):
    pret = pret_service.delete_pret(db=db, pret_id=pret_id)
    if pret is None:
        raise HTTPException(status_code=404, detail="Pret not found")
    return {"message": "Pret deleted successfully"}
