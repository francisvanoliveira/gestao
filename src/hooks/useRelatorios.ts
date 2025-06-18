
import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { jsPDF } from 'jspdf';

export const useRelatorios = () => {
  const { currentUser } = useAuth();
  const { clientes, deslocamentos, usuarios } = useData();
  
  const [filtros, setFiltros] = useState({
    mes: '',
    ano: new Date().getFullYear().toString(),
    cliente_id: '',
    usuario_id: '',
    dataInicio: '',
    dataFim: '',
  });

  const dadosFiltrados = useMemo(() => {
    let dados = deslocamentos;

    // Filtro por usuário baseado no perfil
    if (currentUser?.perfil === 'usuario') {
      dados = dados.filter(d => d.usuario_id === currentUser.id);
    }

    // Aplicar filtros selecionados
    if (filtros.cliente_id && filtros.cliente_id !== 'todos') {
      dados = dados.filter(d => d.cliente_id === filtros.cliente_id);
    }

    if (filtros.usuario_id && filtros.usuario_id !== 'todos' && (currentUser?.perfil === 'gestor' || currentUser?.perfil === 'financeiro')) {
      dados = dados.filter(d => d.usuario_id === filtros.usuario_id);
    }

    if (filtros.mes && filtros.mes !== 'todos' && filtros.ano) {
      dados = dados.filter(d => {
        const data = new Date(d.data_deslocamento);
        return data.getMonth() + 1 === parseInt(filtros.mes) && 
               data.getFullYear() === parseInt(filtros.ano);
      });
    } else if (filtros.ano) {
      dados = dados.filter(d => {
        const data = new Date(d.data_deslocamento);
        return data.getFullYear() === parseInt(filtros.ano);
      });
    }

    if (filtros.dataInicio && filtros.dataFim) {
      dados = dados.filter(d => {
        const data = new Date(d.data_deslocamento);
        const inicio = new Date(filtros.dataInicio);
        const fim = new Date(filtros.dataFim);
        return data >= inicio && data <= fim;
      });
    }

    return dados;
  }, [deslocamentos, filtros, currentUser]);

  const estatisticas = useMemo(() => {
    const total = dadosFiltrados.reduce((acc, d) => acc + (d.valor_ida || 0) + (d.valor_volta || 0), 0);
    const totalValidados = dadosFiltrados.filter(d => d.validado_por_gestor).reduce((acc, d) => acc + (d.valor_ida || 0) + (d.valor_volta || 0), 0);
    const totalFinalizados = dadosFiltrados.filter(d => d.finalizado_por_financeiro).reduce((acc, d) => acc + (d.valor_ida || 0) + (d.valor_volta || 0), 0);

    return {
      totalDeslocamentos: dadosFiltrados.length,
      valorTotal: total,
      valorValidado: totalValidados,
      valorFinalizado: totalFinalizados,
      pendentesValidacao: dadosFiltrados.filter(d => !d.validado_por_gestor).length,
      pendentesFinalizacao: dadosFiltrados.filter(d => d.validado_por_gestor && !d.finalizado_por_financeiro).length,
    };
  }, [dadosFiltrados]);

  const relatorioDetalhado = useMemo(() => {
    return dadosFiltrados.map(d => {
      const cliente = clientes.find(c => c.id === d.cliente_id);
      const usuario = usuarios.find(u => u.id === d.usuario_id);
      
      return {
        ...d,
        clienteNome: cliente?.nome || 'Cliente não encontrado',
        usuarioNome: usuario?.nome_completo || 'Usuário não encontrado',
        valorTotal: (d.valor_ida || 0) + (d.valor_volta || 0),
      };
    });
  }, [dadosFiltrados, clientes, usuarios]);

  const gerarPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.text('RELATÓRIO DE DESLOCAMENTOS', 10, yOffset);
    yOffset += 10;

    doc.text(`Período: ${filtros.dataInicio || 'Não especificado'} até ${filtros.dataFim || 'Não especificado'}`, 10, yOffset);
    yOffset += 15;

    doc.text('RESUMO:', 10, yOffset);
    yOffset += 5;
    doc.text(`- Total de deslocamentos: ${estatisticas.totalDeslocamentos}`, 15, yOffset);
    yOffset += 5;
    doc.text(`- Valor total: R$ ${estatisticas.valorTotal.toFixed(2)}`, 15, yOffset);
    yOffset += 5;
    doc.text(`- Valor validado: R$ ${estatisticas.valorValidado.toFixed(2)}`, 15, yOffset);
    yOffset += 5;
    doc.text(`- Valor finalizado: R$ ${estatisticas.valorFinalizado.toFixed(2)}`, 15, yOffset);
    yOffset += 15;

    doc.text('DETALHES:', 10, yOffset);
    yOffset += 5;

    relatorioDetalhado.forEach(item => {
      doc.text(`Data: ${new Date(item.data_deslocamento).toLocaleDateString('pt-BR')}`, 15, yOffset);
      doc.text(`Cliente: ${item.clienteNome}`, 15, yOffset + 5);
      doc.text(`Usuário: ${item.usuarioNome}`, 15, yOffset + 10);
      doc.text(`Valor: R$ ${item.valorTotal.toFixed(2)}`, 15, yOffset + 15);
      doc.text(`Status: ${item.finalizado_por_financeiro ? 'Finalizado' : item.validado_por_gestor ? 'Validado' : 'Pendente'}`, 15, yOffset + 20);
      yOffset += 30; // Espaçamento entre os itens detalhados
    });

    doc.save(`relatorio-deslocamentos-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const resetFiltros = () => {
    setFiltros({
      mes: '',
      ano: new Date().getFullYear().toString(),
      cliente_id: '',
      usuario_id: '',
      dataInicio: '',
      dataFim: '',
    });
  };

  return {
    currentUser,
    clientes,
    usuarios,
    filtros,
    setFiltros,
    estatisticas,
    relatorioDetalhado,
    gerarPDF,
    resetFiltros,
  };
};
