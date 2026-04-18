import { Pedido } from './pedido.model';

export interface ContratoCredito {
  id?: number;
  pedido?: Pedido;
  bancoAgente: string;
  valorFinanciado: number;
  numeroParcelas: number;
  taxaJuros: number;
}
