
import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Deslocamento } from '../types/entities';
import { useToast } from '@/hooks/use-toast';

export const useDeslocamentos = () => {
  const { currentUser } = useAuth();
  const { clientes, deslocamentos, usuarios, addDeslocamento, updateDeslocamento, deleteDeslocamento, validarDeslocamento, finalizarDeslocamento } = useData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeslocamento, setEditingDeslocamento] = useState<Deslocamento | null>(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    usuario_id: '',
    data_deslocamento: '',
    hora_ida: '',
    hora_volta: '',
    valor_ida: '',
    valor_volta: '',
    meio_transporte: '' as 'uber' | 'veiculo_proprio' | '',
  });

  const filteredDeslocamentos = useMemo(() => {
    if (currentUser?.perfil === 'usuario') {
      return deslocamentos.filter(d => d.usuario_id === currentUser.id);
    } else if (currentUser?.perfil === 'financeiro') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return deslocamentos.filter(d => new Date(d.data_deslocamento) >= thirtyDaysAgo);
    }
    return deslocamentos;
  }, [deslocamentos, currentUser]);

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      usuario_id: currentUser?.id || '',
      data_deslocamento: '',
      hora_ida: '',
      hora_volta: '',
      valor_ida: '',
      valor_volta: '',
      meio_transporte: '',
    });
    setEditingDeslocamento(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Dados do formulário antes do envio:', formData);
    
    const deslocamentoData = {
      ...formData,
      valor_ida: parseFloat(formData.valor_ida),
      valor_volta: parseFloat(formData.valor_volta),
      meio_transporte: formData.meio_transporte as 'uber' | 'veiculo_proprio',
      validado_por_gestor: currentUser?.perfil === 'gestor',
      finalizado_por_financeiro: false,
    };
    
    console.log('Dados finais do deslocamento:', deslocamentoData);
    
    if (editingDeslocamento) {
      updateDeslocamento(editingDeslocamento.id, deslocamentoData);
      toast({
        title: "Deslocamento atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } else {
      addDeslocamento(deslocamentoData);
      toast({
        title: "Deslocamento criado!",
        description: "Novo deslocamento foi adicionado ao sistema.",
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (deslocamento: Deslocamento) => {
    if (deslocamento.validado_por_gestor && currentUser?.perfil === 'usuario') {
      toast({
        title: "Edição não permitida",
        description: "Deslocamentos validados não podem ser editados.",
        variant: "destructive",
      });
      return;
    }

    setEditingDeslocamento(deslocamento);
    setFormData({
      cliente_id: deslocamento.cliente_id,
      usuario_id: deslocamento.usuario_id,
      data_deslocamento: deslocamento.data_deslocamento,
      hora_ida: deslocamento.hora_ida || '',
      hora_volta: deslocamento.hora_volta || '',
      valor_ida: deslocamento.valor_ida?.toString() || '',
      valor_volta: deslocamento.valor_volta?.toString() || '',
      meio_transporte: deslocamento.meio_transporte,
    });
    setDialogOpen(true);
  };

  const handleDelete = (deslocamentoId: string) => {
    deleteDeslocamento(deslocamentoId);
    toast({
      title: "Deslocamento excluído!",
      description: "O deslocamento foi removido do sistema.",
    });
  };

  const handleValidar = (deslocamentoId: string) => {
    validarDeslocamento(deslocamentoId);
    toast({
      title: "Deslocamento validado!",
      description: "O deslocamento foi validado com sucesso.",
    });
  };

  const handleFinalizar = (deslocamentoId: string) => {
    finalizarDeslocamento(deslocamentoId);
    toast({
      title: "Deslocamento finalizado!",
      description: "O deslocamento foi marcado como finalizado.",
    });
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getUsuarioNome = (usuarioId: string) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario?.nome_completo || 'Usuário não encontrado';
  };

  const canEdit = (deslocamento: Deslocamento) => {
    if (currentUser?.perfil === 'gestor') return true;
    if (currentUser?.perfil === 'usuario' && deslocamento.usuario_id === currentUser.id && !deslocamento.validado_por_gestor) return true;
    return false;
  };

  const canDelete = (deslocamento: Deslocamento) => {
    if (currentUser?.perfil === 'gestor') return true;
    if (currentUser?.perfil === 'usuario' && deslocamento.usuario_id === currentUser.id && !deslocamento.validado_por_gestor) return true;
    return false;
  };

  return {
    currentUser,
    clientes,
    usuarios,
    filteredDeslocamentos,
    dialogOpen,
    setDialogOpen,
    editingDeslocamento,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleValidar,
    handleFinalizar,
    getClienteNome,
    getUsuarioNome,
    canEdit,
    canDelete,
  };
};
