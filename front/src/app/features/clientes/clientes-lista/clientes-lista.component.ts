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
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { ConfirmacaoDialogComponent } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-clientes-lista',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css',
})
export class ClientesListaComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  displayedColumns = ['nome', 'cpf', 'rg', 'profissao', 'cidade', 'acoes'];

  auth = inject(AuthService);

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.loading = true;
    this.clienteService.listarTodos().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  verCliente(id: number): void {
    this.router.navigate(['/clientes', id]);
  }

  editarCliente(id: number): void {
    this.router.navigate(['/clientes', id, 'editar']);
  }

  excluirCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja realmente excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado && cliente.id != null) {
        this.clienteService.remover(cliente.id).subscribe({
          next: () => {
            this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.carregarClientes();
          },
        });
      }
    });
  }

  cidadeUf(cliente: Cliente): string {
    return `${cliente.endereco.cidade}/${cliente.endereco.estado}`;
  }
}
