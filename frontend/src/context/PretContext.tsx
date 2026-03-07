import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';
import { getPrets, createPret, updatePret as apiUpdatePret, deletePret as apiDeletePret } from '../services/pretService';

interface PretContextProps {
  prets: PretBancaire[];
  loading: boolean;
  error: string | null;
  loadPrets: () => Promise<void>;
  addPret: (pret: PretBancaireCreate) => Promise<void>;
  updatePret: (id: number, pret: PretBancaireCreate) => Promise<void>;
  deletePret: (id: number) => Promise<void>;
}

export const PretContext = createContext<PretContextProps>({
  prets: [],
  loading: false,
  error: null,
  loadPrets: async () => {},
  addPret: async () => {},
  updatePret: async () => {},
  deletePret: async () => {},
});

export const PretProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prets, setPrets] = useState<PretBancaire[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrets();
  }, []);

  const loadPrets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrets();
      setPrets(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const addPret = async (pret: PretBancaireCreate) => {
    try {
      await createPret(pret);
      await loadPrets();
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de l\'ajout');
    }
  };

  const updatePret = async (id: number, pret: PretBancaireCreate) => {
    try {
      await apiUpdatePret(id, pret);
      await loadPrets();
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la modification');
    }
  };

  const deletePret = async (id: number) => {
    try {
      await apiDeletePret(id);
      await loadPrets();
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <PretContext.Provider value={{ prets, loading, error, loadPrets, addPret, updatePret, deletePret }}>
      {children}
    </PretContext.Provider>
  );
};
