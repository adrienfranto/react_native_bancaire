from pydantic import BaseModel
from datetime import date

class PretBancaireBase(BaseModel):
    n_compte: str
    nom_client: str
    nom_banque: str
    montant: float
    date_pret: date
    taux_pret: float

class PretBancaireCreate(PretBancaireBase):
    pass

class PretBancaireUpdate(PretBancaireBase):
    pass

class PretBancaire(PretBancaireBase):
    id: int

    class Config:
        from_attributes = True
