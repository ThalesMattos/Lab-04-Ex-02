import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Automovel } from '../models/automovel.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AutomovelService {
  private readonly apiUrl = `${environment.apiUrl}/automoveis`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Automovel[]> {
    return this.http.get<Automovel[]>(this.apiUrl);
  }

  listarDisponiveis(): Observable<Automovel[]> {
    return this.http.get<Automovel[]>(`${this.apiUrl}/disponiveis`);
  }

  buscarPorId(id: number): Observable<Automovel> {
    return this.http.get<Automovel>(`${this.apiUrl}/${id}`);
  }

  cadastrar(automovel: Automovel): Observable<Automovel> {
    return this.http.post<Automovel>(this.apiUrl, automovel);
  }

  atualizar(id: number, automovel: Automovel): Observable<Automovel> {
    return this.http.put<Automovel>(`${this.apiUrl}/${id}`, automovel);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
