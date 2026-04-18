import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoService } from '../../../core/services/pedido.service';
import { AutomovelService } from '../../../core/services/automovel.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { Automovel } from '../../../core/models/automovel.model';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-pedidos-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './pedidos-form.component.html',
  styleUrl: './pedidos-form.component.css',
})
export class PedidosFormComponent implements OnInit {
  form!: FormGroup;
  editando = false;
  pedidoId?: number;
  automoveis: Automovel[] = [];
  clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private automovelService: AutomovelService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clienteId: [null, Validators.required],
      automovelId: [null, Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });

    this.automovelService.listarDisponiveis().subscribe((a) => (this.automoveis = a));
    this.clienteService.listarTodos().subscribe((c) => (this.clientes = c));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.pedidoId = +id;
      this.pedidoService.buscarPorId(this.pedidoId).subscribe({
        next: (p) => {
          this.form.patchValue({
            clienteId: p.cliente?.id,
            automovelId: p.automovel?.id,
            dataInicio: p.dataInicio,
            dataFim: p.dataFim,
          });
          // Include current automovel in list even if not in "disponiveis"
          if (p.automovel && !this.automoveis.find((a) => a.id === p.automovel.id)) {
            this.automoveis.push(p.automovel);
          }
        },
        error: () => {
          this.snackBar.open('Pedido não encontrado.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/pedidos']);
        },
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;
    const dados = this.form.value;

    if (this.editando && this.pedidoId) {
      this.pedidoService.modificar(this.pedidoId, dados).subscribe({
        next: () => {
          this.snackBar.open('Pedido atualizado!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          const msg = err.error?.mensagem || 'Erro ao atualizar.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        },
      });
    } else {
      this.pedidoService.criar(dados).subscribe({
        next: () => {
          this.snackBar.open('Pedido criado!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          const msg = err.error?.mensagem || 'Erro ao criar.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        },
      });
    }
  }
}
