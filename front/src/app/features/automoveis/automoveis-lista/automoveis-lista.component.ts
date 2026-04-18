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
import { AutomovelService } from '../../../core/services/automovel.service';
import { Automovel } from '../../../core/models/automovel.model';
import { ConfirmacaoDialogComponent } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-automoveis-lista',
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
  ],
  templateUrl: './automoveis-lista.component.html',
  styleUrl: './automoveis-lista.component.css',
})
export class AutomoveisListaComponent implements OnInit {
  automoveis: Automovel[] = [];
  loading = false;
  displayedColumns = ['placa', 'marca', 'modelo', 'ano', 'disponivel', 'acoes'];

  auth = inject(AuthService);

  constructor(
    private automovelService: AutomovelService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.automovelService.listarTodos().subscribe({
      next: (data) => {
        this.automoveis = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  editar(id: number): void {
    this.router.navigate(['/automoveis', id, 'editar']);
  }

  excluir(auto: Automovel): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja realmente excluir o automóvel "${auto.marca} ${auto.modelo}" (${auto.placa})?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado && auto.id != null) {
        this.automovelService.remover(auto.id).subscribe({
          next: () => {
            this.snackBar.open('Automóvel excluído com sucesso!', 'Fechar', {
              duration: 3000,
            });
            this.carregar();
          },
          error: (err) => {
            const msg = err.error?.mensagem || 'Erro ao excluir automóvel.';
            this.snackBar.open(msg, 'Fechar', { duration: 5000 });
          },
        });
      }
    });
  }
}
