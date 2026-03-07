export interface PretBancaire {
  id: number;
  n_compte: string;
  nom_client: string;
  nom_banque: string;
  montant: number;
  date_pret: string; // YYYY-MM-DD
  taux_pret: number;
}

export interface PretBancaireCreate {
  n_compte: string;
  nom_client: string;
  nom_banque: string;
  montant: number;
  date_pret: string;
  taux_pret: number;
}
