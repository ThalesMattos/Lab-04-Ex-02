import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContratoCredito } from '../models/contrato-credito.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContratoCreditoService {
  private readonly apiUrl = `${environment.apiUrl}/contratos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ContratoCredito[]> {
    return this.http.get<ContratoCredito[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<ContratoCredito> {
    return this.http.get<ContratoCredito>(`${this.apiUrl}/${id}`);
  }

  buscarPorPedido(pedidoId: number): Observable<ContratoCredito> {
    return this.http.get<ContratoCredito>(`${this.apiUrl}/pedido/${pedidoId}`);
  }

  associar(pedidoId: number, contrato: ContratoCredito): Observable<ContratoCredito> {
    return this.http.post<ContratoCredito>(`${this.apiUrl}/pedido/${pedidoId}`, contrato);
  }
}
