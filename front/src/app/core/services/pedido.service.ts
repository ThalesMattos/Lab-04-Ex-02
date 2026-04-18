import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PedidoRequest, AvaliacaoRequest } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  listarPorCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  criar(request: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, request);
  }

  modificar(id: number, request: PedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, request);
  }

  avaliar(id: number, avaliacao: AvaliacaoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/avaliar`, avaliacao);
  }

  cancelar(id: number): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  modificarPeloAgente(id: number, request: PedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/agente`, request);
  }
}
