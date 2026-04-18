import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';
import { ConfirmacaoDialogComponent } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pedidos-lista',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    DatePipe,
  ],
  templateUrl: './pedidos-lista.component.html',
  styleUrl: './pedidos-lista.component.css',
})
export class PedidosListaComponent implements OnInit {
  pedidos: Pedido[] = [];
  loading = false;
  displayedColumns = ['id', 'cliente', 'automovel', 'periodo', 'status', 'acoes'];

  auth = inject(AuthService);

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.pedidoService.listarTodos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  verPedido(id: number): void {
    this.router.navigate(['/pedidos', id]);
  }

  editarPedido(id: number): void {
    this.router.navigate(['/pedidos', id, 'editar']);
  }

  cancelarPedido(pedido: Pedido): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar Cancelamento',
        mensagem: `Deseja realmente cancelar o pedido #${pedido.id}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado && pedido.id != null) {
        this.pedidoService.cancelar(pedido.id).subscribe({
          next: () => {
            this.snackBar.open('Pedido cancelado!', 'Fechar', { duration: 3000 });
            this.carregar();
          },
          error: (err) => {
            const msg = err.error?.mensagem || 'Erro ao cancelar.';
            this.snackBar.open(msg, 'Fechar', { duration: 5000 });
          },
        });
      }
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      AGUARDANDO_ANALISE: 'Aguardando Análise',
      APROVADO: 'Aprovado',
      REPROVADO: 'Reprovado',
      CANCELADO: 'Cancelado',
      CONTRATO_EXECUCAO: 'Contrato em Execução',
    };
    return labels[status] || status;
  }
}
