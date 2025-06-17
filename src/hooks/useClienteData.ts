
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Cliente } from '../types/entities';
import { clienteService } from '../services/clienteService';

export const useClienteData = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const loadClientes = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const data = await clienteService.loadClientes();
      setClientes(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCliente = async (cliente: Omit<Cliente, 'id' | 'criado_em' | 'criado_por_id'>) => {
    if (!currentUser) return;

    try {
      await clienteService.addCliente(cliente, currentUser.id);
      await loadClientes();
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente.",
        variant: "destructive",
      });
    }
  };

  const updateCliente = async (id: string, clienteUpdate: Partial<Cliente>) => {
    try {
      await clienteService.updateCliente(id, clienteUpdate);
      await loadClientes();
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      await clienteService.deleteCliente(id);
      await loadClientes();
      toast({
        title: "Sucesso",
        description: "Cliente deletado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o cliente.",
        variant: "destructive",
      });
    }
  };

  return {
    clientes,
    loading,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  };
};
