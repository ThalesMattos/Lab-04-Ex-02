import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes-detalhe',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clientes-detalhe.component.html',
  styleUrl: './clientes-detalhe.component.css',
})
export class ClientesDetalheComponent implements OnInit {
  cliente: Cliente | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarCliente(+id);
    }
  }

  carregarCliente(id: number): void {
    this.loading = true;
    this.clienteService.buscarPorId(id).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/clientes']);
      },
    });
  }

  enderecoFormatado(): string {
    if (!this.cliente) return '';
    const e = this.cliente.endereco;
    const complemento = e.complemento ? `, ${e.complemento}` : '';
    return `${e.logradouro}, ${e.numero}${complemento} — ${e.bairro}, ${e.cidade}/${e.estado} — CEP: ${e.cep}`;
  }

  voltar(): void {
    this.router.navigate(['/clientes']);
  }

  editar(): void {
    this.router.navigate(['/clientes', this.cliente!.id, 'editar']);
  }
}
