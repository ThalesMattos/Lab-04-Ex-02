export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string; // ex: 'SP'
  cep: string;
}

export interface Empregador {
  nome: string;
  rendimento: number;
}

export interface Cliente {
  id?: number;
  rg: string;
  cpf: string;
  nome: string;
  endereco: Endereco;
  profissao?: string;
  empregadores: Empregador[];
}
