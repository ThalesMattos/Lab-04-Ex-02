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
import { AuthService } from '../../../core/services/auth.service';
import { Automovel } from '../../../core/models/automovel.model';

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
  clienteId?: number;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private automovelService: AutomovelService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      automovelId: [null, Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });

    this.automovelService.listarDisponiveis().subscribe((a) => (this.automoveis = a));

    // Busca o clienteId vinculado ao usuario logado
    const usuario = this.authService.usuarioLogado();
    if (usuario) {
      this.clienteService.buscarPorUsuarioId(usuario.id).subscribe({
        next: (cliente) => {
          this.clienteId = cliente.id;
        },
        error: () => {
          this.snackBar.open(
            'Complete seu cadastro pessoal antes de criar um pedido.',
            'Ir para Meu Cadastro',
            { duration: 6000 }
          ).onAction().subscribe(() => this.router.navigate(['/meu-cadastro']));
          this.router.navigate(['/pedidos']);
        },
      });
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.pedidoId = +id;
      this.pedidoService.buscarPorId(this.pedidoId).subscribe({
        next: (p) => {
          this.clienteId = p.cliente?.id;
          this.form.patchValue({
            automovelId: p.automovel?.id,
            dataInicio: p.dataInicio,
            dataFim: p.dataFim,
          });
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
    if (this.form.invalid || !this.clienteId) return;
    const dados = { ...this.form.value, clienteId: this.clienteId };

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
