import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PedidoService } from '../../../core/services/pedido.service';
import { ContratoCreditoService } from '../../../core/services/contrato-credito.service';
import { Pedido } from '../../../core/models/pedido.model';
import { ContratoCredito } from '../../../core/models/contrato-credito.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmacaoDialogComponent } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog.component';

@Component({
  selector: 'app-pedidos-detalhe',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './pedidos-detalhe.component.html',
  styleUrl: './pedidos-detalhe.component.css',
})
export class PedidosDetalheComponent implements OnInit {
  pedido?: Pedido;
  contrato?: ContratoCredito;
  auth = inject(AuthService);

  avaliacaoForm!: FormGroup;
  contratoForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private contratoService: ContratoCreditoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.avaliacaoForm = this.fb.group({
      justificativa: [''],
    });
    this.contratoForm = this.fb.group({
      bancoAgente: ['', Validators.required],
      valorFinanciado: [null, [Validators.required, Validators.min(0.01)]],
      numeroParcelas: [null, [Validators.required, Validators.min(1)]],
      taxaJuros: [null, [Validators.required, Validators.min(0)]],
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pedidoService.buscarPorId(id).subscribe({
      next: (p) => {
        this.pedido = p;
        this.carregarContrato(id);
      },
      error: () => {
        this.snackBar.open('Pedido não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/pedidos']);
      },
    });
  }

  carregarContrato(pedidoId: number): void {
    this.contratoService.buscarPorPedido(pedidoId).subscribe({
      next: (c) => (this.contrato = c),
      error: () => {},
    });
  }

  aprovar(): void {
    if (!this.pedido?.id) return;
    this.pedidoService
      .avaliar(this.pedido.id, { aprovado: true, justificativa: this.avaliacaoForm.value.justificativa })
      .subscribe({
        next: (p) => {
          this.pedido = p;
          this.snackBar.open('Pedido aprovado!', 'Fechar', { duration: 3000 });
        },
        error: (err) => this.snackBar.open(err.error?.mensagem || 'Erro', 'Fechar', { duration: 5000 }),
      });
  }

  reprovar(): void {
    if (!this.pedido?.id) return;
    this.pedidoService
      .avaliar(this.pedido.id, { aprovado: false, justificativa: this.avaliacaoForm.value.justificativa })
      .subscribe({
        next: (p) => {
          this.pedido = p;
          this.snackBar.open('Pedido reprovado.', 'Fechar', { duration: 3000 });
        },
        error: (err) => this.snackBar.open(err.error?.mensagem || 'Erro', 'Fechar', { duration: 5000 }),
      });
  }

  cancelar(): void {
    if (!this.pedido?.id) return;
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '400px',
      data: { titulo: 'Confirmar Cancelamento', mensagem: `Deseja cancelar o pedido #${this.pedido.id}?` },
    });
    dialogRef.afterClosed().subscribe((ok) => {
      if (ok && this.pedido?.id) {
        this.pedidoService.cancelar(this.pedido.id).subscribe({
          next: (p) => {
            this.pedido = p;
            this.snackBar.open('Pedido cancelado.', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  associarContrato(): void {
    if (this.contratoForm.invalid || !this.pedido?.id) return;
    this.contratoService.associar(this.pedido.id, this.contratoForm.value).subscribe({
      next: (c) => {
        this.contrato = c;
        if (this.pedido) this.pedido.status = 'CONTRATO_EXECUCAO';
        this.snackBar.open('Contrato associado!', 'Fechar', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.mensagem || 'Erro', 'Fechar', { duration: 5000 }),
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
