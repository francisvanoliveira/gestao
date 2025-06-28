import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Download } from 'lucide-react';
import { useRelatorios } from '../../hooks/useRelatorios';
import { RelatorioFilters } from './relatorios/RelatorioFilters';
import { RelatorioEstatisticas } from './relatorios/RelatorioEstatisticas';
import { RelatorioDetalhado } from './relatorios/RelatorioDetalhado';

const Relatorios = () => {
  const {
    currentUser,
    clientes,
    usuarios,
    filtros,
    setFiltros,
    estatisticas,
    relatorioDetalhado,
    gerarPDF,
    resetFiltros,
  } = useRelatorios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            {currentUser?.perfil === 'usuario' ? 'Meus Relatórios' : 'Relatórios'}
          </h1>
          <p className="text-gray-600">Visualize e exporte relatórios de deslocamentos</p>
        </div>
        
        <Button onClick={gerarPDF}>
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <RelatorioFilters
        filtros={filtros}
        setFiltros={setFiltros}
        clientes={clientes}
        usuarios={usuarios}
        currentUser={currentUser}
        resetFiltros={resetFiltros}
      />

      <RelatorioEstatisticas estatisticas={estatisticas} />

      <RelatorioDetalhado relatorioDetalhado={relatorioDetalhado} />
    </div>
  );
};

export default Relatorios;