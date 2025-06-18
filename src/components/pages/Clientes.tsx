
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Cliente } from '../../types/entities';
import InputMask from 'react-input-mask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit2, Trash2, Building } from 'lucide-react';

const Clientes = () => {
  const { currentUser } = useAuth();
  const { clientes, addCliente, updateCliente, deleteCliente } = useData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    observacoes: '',
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      observacoes: '',
    });
    setEditingCliente(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCliente) {
      updateCliente(editingCliente.id, formData);
      toast({
        title: "Cliente atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } else {
      addCliente(formData);
      toast({
        title: "Cliente criado!",
        description: "Novo cliente foi adicionado ao sistema.",
      });
    }

    resetForm();
    setDialogOpen(false);
  };


  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      observacoes: cliente.observacoes,
    });
    setDialogOpen(true);
  };

  const handleDelete = (clienteId: string) => {
    deleteCliente(clienteId);
    toast({
      title: "Cliente excluído!",
      description: "O cliente foi removido do sistema.",
    });
  };

  if (currentUser?.perfil !== 'gestor') {
    return <div>Acesso negado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="h-6 w-6 mr-2" />
            Gestão de Clientes
          </h1>
          <p className="text-gray-600">Gerencie os clientes da empresa</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingCliente 
                  ? 'Atualize as informações do cliente'
                  : 'Preencha os dados para criar um novo cliente'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cliente</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
 <InputMask
 mask="(99) 9999-99999"
 maskChar={null}
 value={formData.telefone}
 onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
 >
 {(inputProps: any) => <Input id="telefone" {...inputProps} required />}
 </InputMask>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCliente ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => (
          <Card key={cliente.id}>
            <CardHeader>
              <CardTitle className="text-lg">{cliente.nome}</CardTitle>
              <CardDescription>{cliente.telefone}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Endereço:</strong> {cliente.endereco}</p>
                <p><strong>Cidade:</strong> {cliente.cidade} - {cliente.estado}</p>
                {cliente.observacoes && (
                  <p><strong>Observações:</strong> {cliente.observacoes}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(cliente)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(cliente.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clientes;

