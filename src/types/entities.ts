
export interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  observacoes: string | null;
  criado_por_id: string;
  criado_em: string;
}

export interface Deslocamento {
  id: string;
  usuario_id: string;
  cliente_id: string;
  data_deslocamento: string;
  hora_ida: string | null;
  hora_volta: string | null;
  valor_ida: number | null;
  valor_volta: number | null;
  meio_transporte: 'uber' | 'veiculo_proprio';
  validado_por_gestor: boolean;
  finalizado_por_financeiro: boolean;
  criado_em: string;
  atualizado_em: string | null;
}

export interface Usuario {
  id: string;
  login: string;
  nome_completo: string;
  perfil: 'gestor' | 'usuario' | 'financeiro';
  criado_em: string;
  atualizado_em: string | null;
}
