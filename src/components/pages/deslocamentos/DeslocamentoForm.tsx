
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Cliente, Usuario } from '../../../types/entities';

interface DeslocamentoFormProps {
  currentUser: any;
  clientes: Cliente[];
  usuarios: Usuario[];
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingDeslocamento: any;
  formData: {
    cliente_id: string;
    usuario_id: string;
    data_deslocamento: string;
    hora_ida: string;
    hora_volta: string;
    valor_ida: string;
    valor_volta: string;
    meio_transporte: 'uber' | 'veiculo_proprio' | '';
  };
  setFormData: (data: any) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const DeslocamentoForm: React.FC<DeslocamentoFormProps> = ({
  currentUser,
  clientes,
  usuarios,
  dialogOpen,
  setDialogOpen,
  editingDeslocamento,
  formData,
  setFormData,
  resetForm,
  handleSubmit,
}) => {
  if (currentUser?.perfil !== 'gestor' && currentUser?.perfil !== 'usuario') {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Deslocamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingDeslocamento ? 'Editar Deslocamento' : 'Novo Deslocamento'}
          </DialogTitle>
          <DialogDescription>
            {editingDeslocamento 
              ? 'Atualize as informações do deslocamento'
              : 'Preencha os dados para criar um novo deslocamento'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentUser?.perfil === 'gestor' && (
            <div className="space-y-2">
              <Label htmlFor="usuario_id">Usuário</Label>
              <Select value={formData.usuario_id} onValueChange={(value) => setFormData({ ...formData, usuario_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.nome_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_deslocamento">Data</Label>
              <Input
                id="data_deslocamento"
                type="date"
                value={formData.data_deslocamento}
                onChange={(e) => setFormData({ ...formData, data_deslocamento: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meio_transporte">Meio de Transporte</Label>
              <Select value={formData.meio_transporte} onValueChange={(value: 'uber' | 'veiculo_proprio') => setFormData({ ...formData, meio_transporte: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o meio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uber">Uber</SelectItem>
                  <SelectItem value="veiculo_proprio">Veículo Próprio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_ida">Hora de Ida</Label>
              <Input
                id="hora_ida"
                type="time"
                value={formData.hora_ida}
                onChange={(e) => setFormData({ ...formData, hora_ida: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hora_volta">Hora de Volta</Label>
              <Input
                id="hora_volta"
                type="time"
                value={formData.hora_volta}
                onChange={(e) => setFormData({ ...formData, hora_volta: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_ida">Valor da Ida (R$)</Label>
              <Input
                id="valor_ida"
                type="number"
                step="0.01"
                value={formData.valor_ida}
                onChange={(e) => setFormData({ ...formData, valor_ida: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor_volta">Valor da Volta (R$)</Label>
              <Input
                id="valor_volta"
                type="number"
                step="0.01"
                value={formData.valor_volta}
                onChange={(e) => setFormData({ ...formData, valor_volta: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingDeslocamento ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
