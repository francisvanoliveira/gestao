
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Users } from 'lucide-react';
import UserCard from './usuarios/UserCard';
import UserDialog from './usuarios/UserDialog';

const Usuarios = () => {
  const { currentUser } = useAuth();
  const { usuarios, addUsuario, updateUsuario, deleteUsuario } = useData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    login: '',
    senha: '',
    perfil: '' as 'gestor' | 'usuario' | 'financeiro' | '',
  });

  const resetForm = () => {
    setFormData({
      nome_completo: '',
      login: '',
      senha: '',
      perfil: '',
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      await updateUsuario(editingUser.id, {
        nome_completo: formData.nome_completo,
        login: formData.login,
        senha: formData.senha,
        perfil: formData.perfil as 'gestor' | 'usuario' | 'financeiro'
      });
    } else {
      await addUsuario({
        nome_completo: formData.nome_completo,
        login: formData.login,
        senha: formData.senha,
        perfil: formData.perfil as 'gestor' | 'usuario' | 'financeiro'
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      nome_completo: user.nome_completo,
      login: user.login,
      senha: '',
      perfil: user.perfil,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Operação não permitida",
        description: "Você não pode excluir seu próprio usuário.",
        variant: "destructive",
      });
      return;
    }

    await deleteUsuario(userId);
  };

  if (currentUser?.perfil !== 'gestor') {
    return <div>Acesso negado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Gestão de Usuários
          </h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <UserDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            editingUser={editingUser}
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
          />
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usuarios.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUserId={currentUser?.id || ''}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
