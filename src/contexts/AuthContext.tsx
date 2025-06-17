
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'gestor' | 'usuario' | 'financeiro';

export interface User {
  id: string;
  nome_completo: string;
  login: string;
  perfil: UserRole;
  criado_em: string;
  atualizado_em?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log('Tentando login com:', { username, password: password.length + ' caracteres' });
      
      // Usar a função RPC para verificar login
      const { data: loginResult, error } = await supabase.rpc('verify_user_login', {
        p_login: username,
        p_password: password
      });

      if (error) {
        console.error('Erro na consulta RPC:', error);
        toast({
          title: "Erro no login",
          description: "Erro interno do servidor. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      if (loginResult && loginResult.length > 0) {
        const userData = loginResult[0];
        const user: User = {
          id: userData.id,
          nome_completo: userData.nome_completo,
          login: userData.login,
          perfil: userData.perfil as UserRole,
          criado_em: userData.criado_em,
          atualizado_em: userData.atualizado_em,
        };
        
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao sistema!",
          variant: "default",
        });
        
        return true;
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateCurrentUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
