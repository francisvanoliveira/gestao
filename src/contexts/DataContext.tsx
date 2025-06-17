
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Cliente, Deslocamento, Usuario } from '../types/entities';
import { useClienteData } from '../hooks/useClienteData';
import { useDeslocamentoData } from '../hooks/useDeslocamentoData';
import { useUsuarioData } from '../hooks/useUsuarioData';

interface DataContextType {
  clientes: Cliente[];
  deslocamentos: Deslocamento[];
  usuarios: Usuario[];
  loading: boolean;
  loadClientes: () => Promise<void>;
  loadDeslocamentos: () => Promise<void>;
  loadUsuarios: () => Promise<void>;
  addCliente: (cliente: Omit<Cliente, 'id' | 'criado_em' | 'criado_por_id'>) => Promise<void>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  addDeslocamento: (deslocamento: Omit<Deslocamento, 'id' | 'criado_em' | 'atualizado_em'>) => Promise<void>;
  updateDeslocamento: (id: string, deslocamento: Partial<Deslocamento>) => Promise<void>;
  deleteDeslocamento: (id: string) => Promise<void>;
  validarDeslocamento: (id: string) => Promise<void>;
  finalizarDeslocamento: (id: string) => Promise<void>;
  addUsuario: (usuario: { nome_completo: string; login: string; senha: string; perfil: 'gestor' | 'usuario' | 'financeiro' }) => Promise<void>;
  updateUsuario: (id: string, usuario: { nome_completo: string; login: string; senha?: string; perfil: 'gestor' | 'usuario' | 'financeiro' }) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Use the separated hooks
  const {
    clientes,
    loading: clientesLoading,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  } = useClienteData();

  const {
    deslocamentos,
    loading: deslocamentosLoading,
    loadDeslocamentos,
    addDeslocamento,
    updateDeslocamento,
    deleteDeslocamento,
    validarDeslocamento,
    finalizarDeslocamento,
  } = useDeslocamentoData();

  const {
    usuarios,
    loading: usuariosLoading,
    loadUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
  } = useUsuarioData();

  // Combined loading state
  const loading = clientesLoading || deslocamentosLoading || usuariosLoading;

  useEffect(() => {
    if (currentUser) {
      console.log('Usuário logado, carregando dados:', currentUser);
      loadClientes();
      loadDeslocamentos();
      loadUsuarios(); // Carregar sempre, independente do perfil
    }
  }, [currentUser]);

  return (
    <DataContext.Provider value={{
      clientes,
      deslocamentos,
      usuarios,
      loading,
      loadClientes,
      loadDeslocamentos,
      loadUsuarios,
      addCliente,
      updateCliente,
      deleteCliente,
      addDeslocamento,
      updateDeslocamento,
      deleteDeslocamento,
      validarDeslocamento,
      finalizarDeslocamento,
      addUsuario,
      updateUsuario,
      deleteUsuario,
    }}>
      {children}
    </DataContext.Provider>
  );
};
