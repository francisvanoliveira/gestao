
import { supabase } from '@/integrations/supabase/client';
import { Cliente } from '../types/entities';

export const clienteService = {
  async loadClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao carregar clientes:', error);
      throw error;
    }

    return data || [];
  },

  async addCliente(cliente: Omit<Cliente, 'id' | 'criado_em' | 'criado_por_id'>, currentUserId: string): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        ...cliente,
        criado_por_id: currentUserId
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }

    return data;
  },

  async updateCliente(id: string, clienteUpdate: Partial<Cliente>): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .update(clienteUpdate)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  async deleteCliente(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }
};
