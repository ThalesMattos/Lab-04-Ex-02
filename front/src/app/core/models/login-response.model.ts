import { TipoUsuario } from './usuario.model';

export interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}
