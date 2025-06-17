
import { User } from '../../../contexts/AuthContext';

export const loadUsuarios = (): User[] => {
  const savedUsers = localStorage.getItem('users');
  return savedUsers ? JSON.parse(savedUsers) : [];
};

export const saveUsuarios = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};
