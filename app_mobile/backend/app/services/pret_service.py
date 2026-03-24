from sqlalchemy.orm import Session
from app.models.pret import PretBancaire
from app.schemas.pret import PretBancaireCreate, PretBancaireUpdate

class PretService:
    def get_prets(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(PretBancaire).offset(skip).limit(limit).all()

    def get_pret(self, db: Session, pret_id: int):
        return db.query(PretBancaire).filter(PretBancaire.id == pret_id).first()

    def create_pret(self, db: Session, pret: PretBancaireCreate):
        db_pret = PretBancaire(**pret.dict())
        db.add(db_pret)
        db.commit()
        db.refresh(db_pret)
        return db_pret

    def update_pret(self, db: Session, pret_id: int, pret: PretBancaireUpdate):
        db_pret = self.get_pret(db, pret_id)
        if db_pret:
            for key, value in pret.dict().items():
                setattr(db_pret, key, value)
            db.commit()
            db.refresh(db_pret)
        return db_pret

    def delete_pret(self, db: Session, pret_id: int):
        pret = self.get_pret(db, pret_id)
        if pret:
            db.delete(pret)
            db.commit()
        return pret

pret_service = PretService()
