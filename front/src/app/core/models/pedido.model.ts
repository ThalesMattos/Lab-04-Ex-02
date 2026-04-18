import { Cliente } from './cliente.model';
import { Automovel } from './automovel.model';

export type StatusPedido = 'AGUARDANDO_ANALISE' | 'APROVADO' | 'REPROVADO' | 'CANCELADO' | 'CONTRATO_EXECUCAO';

export interface Pedido {
  id?: number;
  cliente: Cliente;
  automovel: Automovel;
  dataInicio: string;
  dataFim: string;
  status: StatusPedido;
  justificativa?: string;
}

export interface PedidoRequest {
  clienteId: number;
  automovelId: number;
  dataInicio: string;
  dataFim: string;
}

export interface AvaliacaoRequest {
  aprovado: boolean;
  justificativa?: string;
}
