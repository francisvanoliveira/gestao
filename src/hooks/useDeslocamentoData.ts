
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Deslocamento } from '../types/entities';
import { deslocamentoService } from '../services/deslocamentoService';

export const useDeslocamentoData = () => {
  const [deslocamentos, setDeslocamentos] = useState<Deslocamento[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadDeslocamentos = async () => {
    try {
      setLoading(true);
      const data = await deslocamentoService.loadDeslocamentos();
      setDeslocamentos(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os deslocamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDeslocamento = async (deslocamento: Omit<Deslocamento, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      console.log('Criando deslocamento:', deslocamento);
      await deslocamentoService.addDeslocamento(deslocamento);
      await loadDeslocamentos();
      toast({
        title: "Sucesso",
        description: "Deslocamento criado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar deslocamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o deslocamento.",
        variant: "destructive",
      });
    }
  };

  const updateDeslocamento = async (id: string, deslocamentoUpdate: Partial<Deslocamento>) => {
    try {
      await deslocamentoService.updateDeslocamento(id, deslocamentoUpdate);
      await loadDeslocamentos();
      toast({
        title: "Sucesso",
        description: "Deslocamento atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o deslocamento.",
        variant: "destructive",
      });
    }
  };

  const deleteDeslocamento = async (id: string) => {
    try {
      await deslocamentoService.deleteDeslocamento(id);
      await loadDeslocamentos();
      toast({
        title: "Sucesso",
        description: "Deslocamento deletado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o deslocamento.",
        variant: "destructive",
      });
    }
  };

  const validarDeslocamento = async (id: string) => {
    await updateDeslocamento(id, { validado_por_gestor: true });
  };

  const finalizarDeslocamento = async (id: string) => {
    await updateDeslocamento(id, { finalizado_por_financeiro: true });
  };

  return {
    deslocamentos,
    loading,
    loadDeslocamentos,
    addDeslocamento,
    updateDeslocamento,
    deleteDeslocamento,
    validarDeslocamento,
    finalizarDeslocamento,
  };
};
