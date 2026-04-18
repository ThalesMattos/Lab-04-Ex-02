import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        // erros 4xx são tratados inline em cada componente; aqui só trata falhas de rede/servidor
      if (error.status === 0) {
        snackBar.open(
          'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
          'Fechar',
          { duration: 6000, panelClass: ['error-snackbar'] }
        );
      } else if (error.status >= 500) {
        snackBar.open(
          'Erro interno do servidor. Tente novamente mais tarde.',
          'Fechar',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }

      return throwError(() => error);
    })
  );
};
