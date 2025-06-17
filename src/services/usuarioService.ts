
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '../types/entities';

export const usuarioService = {
  async loadUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome_completo');

    if (error) {
      console.error('Erro ao carregar usuários:', error);
      throw error;
    }

    return data || [];
  },

  async addUsuario(usuario: { nome_completo: string; login: string; senha: string; perfil: 'gestor' | 'usuario' | 'financeiro' }): Promise<Usuario> {
    // Inserção direta na tabela usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nome_completo: usuario.nome_completo,
        login: usuario.login,
        senha: usuario.senha, // Por enquanto, senha em texto plano para desenvolvimento
        perfil: usuario.perfil
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }

    return data;
  },

  async updateUsuario(id: string, usuario: { nome_completo: string; login: string; senha?: string; perfil: 'gestor' | 'usuario' | 'financeiro' }): Promise<void> {
    const updateData: any = {
      nome_completo: usuario.nome_completo,
      login: usuario.login,
      perfil: usuario.perfil,
      atualizado_em: new Date().toISOString()
    };

    if (usuario.senha && usuario.senha.trim() !== '') {
      updateData.senha = usuario.senha; // Por enquanto, senha em texto plano para desenvolvimento
    }

    const { error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async deleteUsuario(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
};
