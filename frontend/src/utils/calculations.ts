import { PretBancaire } from '../models/Pret';

export const calculateMontantAPayer = (pret: PretBancaire | { montant: number, taux_pret: number }): number => {
  return pret.montant * (1 + pret.taux_pret);
};

export const calculateTotals = (prets: PretBancaire[]) => {
  if (prets.length === 0) return { total: 0, min: 0, max: 0 };

  let total = 0;
  let min = calculateMontantAPayer(prets[0]);
  let max = calculateMontantAPayer(prets[0]);

  prets.forEach(p => {
    const aPayer = calculateMontantAPayer(p);
    total += aPayer;
    if (aPayer < min) min = aPayer;
    if (aPayer > max) max = aPayer;
  });

  return { total, min, max };
};
