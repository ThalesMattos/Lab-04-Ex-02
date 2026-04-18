export type TipoProprietario = 'CLIENTE' | 'EMPRESA' | 'BANCO';

export interface Automovel {
  id?: number;
  matricula: string;
  ano: number;
  marca: string;
  modelo: string;
  placa: string;
  tipoProprietario: TipoProprietario;
  nomeProprietario?: string;
  disponivel: boolean;
}
