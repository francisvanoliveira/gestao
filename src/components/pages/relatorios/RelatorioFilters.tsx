
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { Cliente, Usuario } from '../../../types/entities';

interface RelatorioFiltersProps {
  filtros: {
    mes: string;
    ano: string;
    cliente_id: string;
    usuario_id: string;
    dataInicio: string;
    dataFim: string;
  };
  setFiltros: (filtros: any) => void;
  clientes: Cliente[];
  usuarios: Usuario[];
  currentUser: any;
  resetFiltros: () => void;
}

export const RelatorioFilters: React.FC<RelatorioFiltersProps> = ({
  filtros,
  setFiltros,
  clientes,
  usuarios,
  currentUser,
  resetFiltros
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Configure os filtros para gerar seu relatório</CardDescription>
          </div>
          <Button variant="outline" onClick={resetFiltros}>
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ano">Ano</Label>
            <Select value={filtros.ano} onValueChange={(value) => setFiltros({ ...filtros, ano: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(ano => (
                  <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mes">Mês</Label>
            <Select value={filtros.mes} onValueChange={(value) => setFiltros({ ...filtros, mes: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os meses</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2023, i).toLocaleDateString('pt-BR', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Select value={filtros.cliente_id} onValueChange={(value) => setFiltros({ ...filtros, cliente_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os clientes</SelectItem>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(currentUser?.perfil === 'gestor' || currentUser?.perfil === 'financeiro') && (
            <div className="space-y-2">
              <Label htmlFor="usuario_id">Usuário</Label>
              <Select value={filtros.usuario_id} onValueChange={(value) => setFiltros({ ...filtros, usuario_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os usuários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os usuários</SelectItem>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>{usuario.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
