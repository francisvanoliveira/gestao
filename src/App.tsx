
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Usuarios from './components/pages/Usuarios';
import Clientes from './components/pages/Clientes';
import Deslocamentos from './components/pages/Deslocamentos';
import Relatorios from './components/pages/Relatorios';
import Perfil from './components/pages/Perfil';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentUser, loading } = useAuth();
  // Mudança: página padrão agora é 'perfil' para todos os usuários
  const [currentPage, setCurrentPage] = useState('perfil');

  const renderPage = () => {
    switch (currentPage) {
      case 'usuarios':
        return <Usuarios />;
      case 'clientes':
        return <Clientes />;
      case 'deslocamentos':
        return <Deslocamentos />;
      case 'relatorios':
        return <Relatorios />;
      case 'perfil':
        return <Perfil />;
      default:
        return <Perfil />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
