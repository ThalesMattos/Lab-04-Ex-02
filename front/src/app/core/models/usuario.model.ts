export type TipoUsuario = 'CLIENTE' | 'AGENTE';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
}
