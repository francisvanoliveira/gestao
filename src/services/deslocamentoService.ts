
import { supabase } from '@/integrations/supabase/client';
import { Deslocamento } from '../types/entities';

export const deslocamentoService = {
  async loadDeslocamentos(): Promise<Deslocamento[]> {
    const { data, error } = await supabase
      .from('deslocamentos')
      .select(`
        *,
        clientes(nome),
        usuarios(nome_completo)
      `)
      .order('data_deslocamento', { ascending: false });

    if (error) {
      console.error('Erro ao carregar deslocamentos:', error);
      throw error;
    }

    return data || [];
  },

  async addDeslocamento(deslocamento: Omit<Deslocamento, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Deslocamento> {
    const { data, error } = await supabase
      .from('deslocamentos')
      .insert([deslocamento])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar deslocamento:', error);
      throw error;
    }

    return data;
  },

  async updateDeslocamento(id: string, deslocamentoUpdate: Partial<Deslocamento>): Promise<void> {
    const { error } = await supabase
      .from('deslocamentos')
      .update(deslocamentoUpdate)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar deslocamento:', error);
      throw error;
    }
  },

  async deleteDeslocamento(id: string): Promise<void> {
    const { error } = await supabase
      .from('deslocamentos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar deslocamento:', error);
      throw error;
    }
  },

  async validarDeslocamento(id: string): Promise<void> {
    await deslocamentoService.updateDeslocamento(id, { validado_por_gestor: true });
  },

  async finalizarDeslocamento(id: string): Promise<void> {
    await deslocamentoService.updateDeslocamento(id, { finalizado_por_financeiro: true });
  }
};
