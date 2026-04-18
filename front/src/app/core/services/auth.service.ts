import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/login-response.model';
import { Usuario } from '../models/usuario.model';

const STORAGE_KEY = 'usuario_logado';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private _usuarioLogado = signal<LoginResponse | null>(
    this.carregarDoStorage()
  );

  readonly usuarioLogado = this._usuarioLogado.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap((resp) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resp));
          this._usuarioLogado.set(resp);
        })
      );
  }

  cadastrar(usuario: Omit<Usuario, 'id'>): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/cadastro`, usuario)
      .pipe(
        tap((resp) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resp));
          this._usuarioLogado.set(resp);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._usuarioLogado.set(null);
    this.router.navigate(['/login']);
  }

  estaLogado(): boolean {
    return this._usuarioLogado() !== null;
  }

  ehAgente(): boolean {
    return this._usuarioLogado()?.tipo === 'AGENTE';
  }

  ehCliente(): boolean {
    return this._usuarioLogado()?.tipo === 'CLIENTE';
  }

  private carregarDoStorage(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LoginResponse) : null;
    } catch {
      return null;
    }
  }
}
