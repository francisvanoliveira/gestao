
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelatorioDetalhadoItem {
  id: string;
  clienteNome: string;
  usuarioNome: string;
  data_deslocamento: string;
  meio_transporte: string;
  valorTotal: number;
  validado_por_gestor: boolean;
  finalizado_por_financeiro: boolean;
}

interface RelatorioDetalhadoProps {
  relatorioDetalhado: RelatorioDetalhadoItem[];
}

export const RelatorioDetalhado: React.FC<RelatorioDetalhadoProps> = ({ relatorioDetalhado }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhamento</CardTitle>
        <CardDescription>Lista detalhada dos deslocamentos filtrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatorioDetalhado.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{item.clienteNome}</p>
                    <p className="text-sm text-gray-600">{item.usuarioNome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-medium">{new Date(item.data_deslocamento).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meio</p>
                    <p className="font-medium">{item.meio_transporte === 'uber' ? 'Uber' : 'Veículo Próprio'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold">R$ {item.valorTotal.toFixed(2)}</p>
                  <div className="flex space-x-1">
                    {item.finalizado_por_financeiro ? (
                      <Badge className="bg-blue-100 text-blue-800">Finalizado</Badge>
                    ) : item.validado_por_gestor ? (
                      <Badge className="bg-green-100 text-green-800">Validado</Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
