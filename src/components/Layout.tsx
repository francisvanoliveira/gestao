
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Users, 
  Building, 
  Car, 
  BarChart3, 
  User,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'perfil', label: 'Meu Perfil', icon: User, roles: ['gestor', 'usuario', 'financeiro'] },
    ];

    if (currentUser?.perfil === 'gestor') {
      baseItems.push(
        { id: 'usuarios', label: 'Usuários', icon: Users, roles: ['gestor'] },
        { id: 'clientes', label: 'Clientes', icon: Building, roles: ['gestor'] },
        { id: 'deslocamentos', label: 'Deslocamentos', icon: Car, roles: ['gestor'] },
        { id: 'relatorios', label: 'Relatórios', icon: BarChart3, roles: ['gestor'] }
      );
    } else if (currentUser?.perfil === 'usuario') {
      baseItems.push(
        { id: 'deslocamentos', label: 'Meus Deslocamentos', icon: Car, roles: ['usuario'] },
        { id: 'relatorios', label: 'Meus Relatórios', icon: BarChart3, roles: ['usuario'] }
      );
    } else if (currentUser?.perfil === 'financeiro') {
      baseItems.push(
        { id: 'deslocamentos', label: 'Deslocamentos', icon: Car, roles: ['financeiro'] },
        { id: 'relatorios', label: 'Relatórios', icon: BarChart3, roles: ['financeiro'] }
      );
    }

    return baseItems.filter(item => item.roles.includes(currentUser?.perfil || ''));
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Deslocamentos</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900">{currentUser?.nome_completo}</p>
            <Badge className={`mt-1 ${getRoleColor(currentUser?.perfil || '')}`}>
              {getRoleLabel(currentUser?.perfil || '')}
            </Badge>
          </div>
          
          <nav className="space-y-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onPageChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Deslocamentos</h1>
            <div className="w-10" />
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
