
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Usuario } from '../types/entities';
import { usuarioService } from '../services/usuarioService';

export const useUsuarioData = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Função para sincronizar usuários com localStorage
  const syncUsuariosWithLocalStorage = (usuariosData: Usuario[]) => {
    console.log('Sincronizando usuários com localStorage:', usuariosData);
    localStorage.setItem('users', JSON.stringify(usuariosData));
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.loadUsuarios();
      console.log('Usuários carregados do Supabase:', data);
      setUsuarios(data);
      // Sincronizar com localStorage para manter compatibilidade
      syncUsuariosWithLocalStorage(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUsuario = async (usuario: { nome_completo: string; login: string; senha: string; perfil: 'gestor' | 'usuario' | 'financeiro' }) => {
    try {
      await usuarioService.addUsuario(usuario);
      await loadUsuarios(); // Isso vai recarregar e sincronizar automaticamente
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o usuário.",
        variant: "destructive",
      });
    }
  };

  const updateUsuario = async (id: string, usuario: { nome_completo: string; login: string; senha?: string; perfil: 'gestor' | 'usuario' | 'financeiro' }) => {
    try {
      await usuarioService.updateUsuario(id, usuario);
      await loadUsuarios(); // Isso vai recarregar e sincronizar automaticamente
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const deleteUsuario = async (id: string) => {
    try {
      await usuarioService.deleteUsuario(id);
      await loadUsuarios(); // Isso vai recarregar e sincronizar automaticamente
      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o usuário.",
        variant: "destructive",
      });
    }
  };

  return {
    usuarios,
    loading,
    loadUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
  };
};
