import api from './api';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';

export const getPrets = async (): Promise<PretBancaire[]> => {
  const response = await api.get('/prets/');
  return response.data;
};

export const createPret = async (pret: PretBancaireCreate): Promise<PretBancaire> => {
  const response = await api.post('/prets/', pret);
  return response.data;
};

export const updatePret = async (id: number, pret: PretBancaireCreate): Promise<PretBancaire> => {
  const response = await api.put(`/prets/${id}`, pret);
  return response.data;
};

export const deletePret = async (id: number): Promise<void> => {
  await api.delete(`/prets/${id}`);
};
