import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { clienteOnlyGuard } from './core/guards/cliente-only.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clientes',
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
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/clientes/clientes-lista/clientes-lista.component'
      ).then((m) => m.ClientesListaComponent),
  },
  {
    // 'novo' deve vir antes de ':id', senão o Angular trata 'novo' como parâmetro
    path: 'clientes/novo',
    canActivate: [authGuard, clienteOnlyGuard],
    loadComponent: () =>
      import(
        './features/clientes/clientes-form/clientes-form.component'
      ).then((m) => m.ClientesFormComponent),
  },
  {
    path: 'clientes/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/clientes/clientes-form/clientes-form.component'
      ).then((m) => m.ClientesFormComponent),
  },
  {
    path: 'clientes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/clientes/clientes-detalhe/clientes-detalhe.component'
      ).then((m) => m.ClientesDetalheComponent),
  },
];
