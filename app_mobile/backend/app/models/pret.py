from sqlalchemy import Column, Integer, String, Float, Date
from app.core.database import Base

class PretBancaire(Base):
    __tablename__ = "pret_bancaires"

    id = Column(Integer, primary_key=True, index=True)
    n_compte = Column(String, index=True)
    nom_client = Column(String, index=True)
    nom_banque = Column(String, index=True)
    montant = Column(Float)
    date_pret = Column(Date)
    taux_pret = Column(Float)
