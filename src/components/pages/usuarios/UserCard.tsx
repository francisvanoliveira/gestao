
import React from 'react';
import { User, UserRole } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';

interface UserCardProps {
  user: User;
  currentUserId: string;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUserId, onEdit, onDelete }) => {
  const getRoleLabel = (role: UserRole) => {
    const labels = {
      gestor: 'Gestor',
      usuario: 'Usuário',
      financeiro: 'Financeiro'
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      gestor: 'bg-red-100 text-red-800',
      usuario: 'bg-blue-100 text-blue-800',
      financeiro: 'bg-green-100 text-green-800'
    };
    return colors[role];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{user.nome_completo}</CardTitle>
          <Badge className={getRoleColor(user.perfil)}>
            {getRoleLabel(user.perfil)}
          </Badge>
        </div>
        <CardDescription>@{user.login}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(user.id)}
            disabled={user.id === currentUserId}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
