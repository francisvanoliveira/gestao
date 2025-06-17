
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EstatisticasData {
  totalDeslocamentos: number;
  valorTotal: number;
  valorValidado: number;
  valorFinalizado: number;
  pendentesValidacao: number;
  pendentesFinalizacao: number;
}

interface RelatorioEstatisticasProps {
  estatisticas: EstatisticasData;
}

export const RelatorioEstatisticas: React.FC<RelatorioEstatisticasProps> = ({ estatisticas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total de Deslocamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{estatisticas.totalDeslocamentos}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valor Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">R$ {estatisticas.valorTotal.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valor Finalizado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-600">R$ {estatisticas.valorFinalizado.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pendentes Validação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-600">{estatisticas.pendentesValidacao}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pendentes Finalização</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-600">{estatisticas.pendentesFinalizacao}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valor Validado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-indigo-600">R$ {estatisticas.valorValidado.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
