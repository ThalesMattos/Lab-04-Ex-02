import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { clienteOnlyGuard } from './core/guards/cliente-only.guard';
import { agenteOnlyGuard } from './core/guards/agente-only.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pedidos',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./features/auth/cadastro/cadastro.component').then(
        (m) => m.CadastroComponent
      ),
  },
  // --- Meu Cadastro (cliente edita seus próprios dados) ---
  {
    path: 'meu-cadastro',
    canActivate: [authGuard, clienteOnlyGuard],
    loadComponent: () =>
      import(
        './features/clientes/meu-cadastro/meu-cadastro.component'
      ).then((m) => m.MeuCadastroComponent),
  },
  // --- Clientes (agente visualiza lista para análise) ---
  {
    path: 'clientes',
    canActivate: [authGuard, agenteOnlyGuard],
    loadComponent: () =>
      import(
        './features/clientes/clientes-lista/clientes-lista.component'
      ).then((m) => m.ClientesListaComponent),
  },
  {
    path: 'clientes/:id',
    canActivate: [authGuard, agenteOnlyGuard],
    loadComponent: () =>
      import(
        './features/clientes/clientes-detalhe/clientes-detalhe.component'
      ).then((m) => m.ClientesDetalheComponent),
  },
  // --- Automóveis ---
  {
    path: 'automoveis',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/automoveis/automoveis-lista/automoveis-lista.component'
      ).then((m) => m.AutomoveisListaComponent),
  },
  {
    path: 'automoveis/novo',
    canActivate: [authGuard, agenteOnlyGuard],
    loadComponent: () =>
      import(
        './features/automoveis/automoveis-form/automoveis-form.component'
      ).then((m) => m.AutomoveisFormComponent),
  },
  {
    path: 'automoveis/:id/editar',
    canActivate: [authGuard, agenteOnlyGuard],
    loadComponent: () =>
      import(
        './features/automoveis/automoveis-form/automoveis-form.component'
      ).then((m) => m.AutomoveisFormComponent),
  },
  // --- Pedidos ---
  {
    path: 'pedidos',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/pedidos/pedidos-lista/pedidos-lista.component'
      ).then((m) => m.PedidosListaComponent),
  },
  {
    path: 'pedidos/novo',
    canActivate: [authGuard, clienteOnlyGuard],
    loadComponent: () =>
      import(
        './features/pedidos/pedidos-form/pedidos-form.component'
      ).then((m) => m.PedidosFormComponent),
  },
  {
    path: 'pedidos/:id/editar',
    canActivate: [authGuard, clienteOnlyGuard],
    loadComponent: () =>
      import(
        './features/pedidos/pedidos-form/pedidos-form.component'
      ).then((m) => m.PedidosFormComponent),
  },
  {
    path: 'pedidos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/pedidos/pedidos-detalhe/pedidos-detalhe.component'
      ).then((m) => m.PedidosDetalheComponent),
  },
];
