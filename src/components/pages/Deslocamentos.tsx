
import React from 'react';
import { Car } from 'lucide-react';
import { useDeslocamentos } from '../../hooks/useDeslocamentos';
import { DeslocamentoForm } from './deslocamentos/DeslocamentoForm';
import { DeslocamentoCard } from './deslocamentos/DeslocamentoCard';

const Deslocamentos = () => {
  const {
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
  } = useDeslocamentos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Car className="h-6 w-6 mr-2" />
            {currentUser?.perfil === 'usuario' ? 'Meus Deslocamentos' : 'Gestão de Deslocamentos'}
          </h1>
          <p className="text-gray-600">
            {currentUser?.perfil === 'usuario' 
              ? 'Gerencie seus deslocamentos'
              : currentUser?.perfil === 'financeiro'
              ? 'Deslocamentos dos últimos 30 dias'
              : 'Gerencie todos os deslocamentos'
            }
          </p>
        </div>
        
        <DeslocamentoForm
          currentUser={currentUser}
          clientes={clientes}
          usuarios={usuarios}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          editingDeslocamento={editingDeslocamento}
          formData={formData}
          setFormData={setFormData}
          resetForm={resetForm}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="space-y-4">
        {filteredDeslocamentos.map((deslocamento) => (
          <DeslocamentoCard
            key={deslocamento.id}
            deslocamento={deslocamento}
            currentUser={currentUser}
            getClienteNome={getClienteNome}
            getUsuarioNome={getUsuarioNome}
            canEdit={canEdit}
            canDelete={canDelete}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleValidar={handleValidar}
            handleFinalizar={handleFinalizar}
          />
        ))}
      </div>
    </div>
  );
};

export default Deslocamentos;
