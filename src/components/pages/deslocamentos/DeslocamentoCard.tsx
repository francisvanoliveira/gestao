import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Check, CheckCheck } from 'lucide-react';
import { Deslocamento } from '../../../types/entities';

interface DeslocamentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  deslocamento: Deslocamento;
  currentUser: any;
  canEdit: (deslocamento: Deslocamento) => boolean;
  canDelete: (deslocamento: Deslocamento) => boolean;
  handleEdit: (deslocamento: Deslocamento) => void;
  handleDelete: (deslocamentoId: string) => void;
  handleValidar: (deslocamentoId: string) => void;
  handleFinalizar: (deslocamentoId: string) => void;
  clienteNome: string;
  usuarioNome: string;
}

export const DeslocamentoCard: React.FC<DeslocamentoCardProps> = ({
  deslocamento,
  currentUser,
  canEdit,
  canDelete,
  handleEdit,
  handleDelete,
  handleValidar,
  handleFinalizar,
  clienteNome,
  usuarioNome,
  ...props
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{clienteNome}</CardTitle>
            <CardDescription className="flex items-center text-sm text-gray-500">
              {usuarioNome} •
              {/* Formata a data do deslocamento para o fuso horário do Brasil (America/Sao_Paulo) */}
              {new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // timeZoneName: 'short', // Removido esta linha
              }).format(new Date(deslocamento.data_deslocamento + 'T00:00:00'))}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {deslocamento.validado_por_gestor && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Validado
              </Badge>
            )}
            {deslocamento.finalizado_por_financeiro && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Finalizado
              </Badge>
            )}
            <Badge variant="outline">
              {deslocamento.meio_transporte === 'uber' ? 'Uber' : 'Veículo Próprio'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Hora de Ida</p>
            <p className="font-medium">{deslocamento.hora_ida}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hora de Volta</p>
            <p className="font-medium">{deslocamento.hora_volta}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Ida</p>
            <p className="font-medium">R$ {deslocamento.valor_ida?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Volta</p>
            <p className="font-medium">R$ {deslocamento.valor_volta?.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-lg font-semibold">
              Total: R$ {((deslocamento.valor_ida || 0) + (deslocamento.valor_volta || 0)).toFixed(2)}
            </p>
          </div>

          <div className="flex space-x-2 flex-wrap gap-2">
            {currentUser?.perfil === 'gestor' && !deslocamento.validado_por_gestor && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleValidar(deslocamento.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Validar
              </Button>
            )}

            {currentUser?.perfil === 'financeiro' && deslocamento.validado_por_gestor && !deslocamento.finalizado_por_financeiro && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleFinalizar(deslocamento.id)}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Finalizar
              </Button>
            )}

            {canEdit(deslocamento) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(deslocamento)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}

            {canDelete(deslocamento) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(deslocamento.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
