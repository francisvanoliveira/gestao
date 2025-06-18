
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usuarioService } from '../../services/usuarioService';
import { User, Save } from 'lucide-react';

const Perfil = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome_completo: currentUser?.nome_completo || '',
    login: currentUser?.login || '',
    senha: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    try {
      await usuarioService.updateUsuario(currentUser.id, {
        nome_completo: formData.nome_completo,
        login: formData.login,
        senha: formData.senha,
        perfil: currentUser.perfil, // Manter o perfil existente
      });

      // Atualizar o usuário atual no contexto
      updateCurrentUser({ ...currentUser, ...formData });

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      gestor: 'Gestor',
      usuario: 'Usuário',
      financeiro: 'Financeiro'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      gestor: 'bg-red-100 text-red-800',
      usuario: 'bg-blue-100 text-blue-800',
      financeiro: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <User className="h-6 w-6 mr-2" />
          Meu Perfil
        </h1>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Seus dados no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="font-medium">{currentUser?.nome_completo}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Login</p>
              <p className="font-medium">@{currentUser?.login}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Perfil de Acesso</p>
              <Badge className={getRoleColor(currentUser?.perfil || '')}>
                {getRoleLabel(currentUser?.perfil || '')}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Membro desde</p>
              <p className="font-medium">
                {currentUser?.criado_em ? new Date(currentUser.criado_em).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Editar Informações</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Nova Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="Deixe em branco para manter a senha atual"
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
