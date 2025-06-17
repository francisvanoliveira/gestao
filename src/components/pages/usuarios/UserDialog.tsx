
import React from 'react';
import { User, UserRole } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  formData: {
    nome_completo: string;
    login: string;
    senha: string;
    perfil: UserRole | '';
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onOpenChange,
  editingUser,
  formData,
  onFormDataChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {editingUser 
              ? 'Atualize as informações do usuário'
              : 'Preencha os dados para criar um novo usuário'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input
              id="nome_completo"
              value={formData.nome_completo}
              onChange={(e) => onFormDataChange({ ...formData, nome_completo: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              value={formData.login}
              onChange={(e) => onFormDataChange({ ...formData, login: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={(e) => onFormDataChange({ ...formData, senha: e.target.value })}
              required={!editingUser}
              placeholder={editingUser ? "Deixe em branco para manter a senha atual" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perfil">Perfil</Label>
            <Select value={formData.perfil} onValueChange={(value: UserRole) => onFormDataChange({ ...formData, perfil: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingUser ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
