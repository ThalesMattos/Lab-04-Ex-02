import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskDirective } from 'ngx-mask';
import { ClienteService } from '../../../core/services/cliente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cliente } from '../../../core/models/cliente.model';
import { ErroAlertComponent } from '../../../shared/components/erro-alert/erro-alert.component';

interface ViaCepResponse {
  erro?: boolean;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

@Component({
  selector: 'app-meu-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    NgxMaskDirective,
    ErroAlertComponent,
  ],
  templateUrl: './meu-cadastro.component.html',
  styleUrl: './meu-cadastro.component.css',
})
export class MeuCadastroComponent implements OnInit {
  form!: FormGroup;
  estados = ESTADOS;
  isEdicao = false;
  clienteId: number | null = null;
  loading = false;
  salvando = false;
  erroApi: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    const usuario = this.authService.usuarioLogado();
    if (usuario) {
      this.loading = true;
      this.clienteService.buscarPorUsuarioId(usuario.id).subscribe({
        next: (cliente) => {
          this.isEdicao = true;
          this.clienteId = cliente.id!;
          while (this.empregadores.length) this.empregadores.removeAt(0);
          (cliente.empregadores ?? []).forEach(() => this.adicionarEmpregador());
          this.form.patchValue(cliente);
          this.loading = false;
        },
        error: () => {
          // 404 = cliente ainda não cadastrou seus dados pessoais
          this.isEdicao = false;
          this.loading = false;
        },
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['', Validators.required],
      profissao: [''],
      endereco: this.fb.group({
        cep: [''],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required],
      }),
      empregadores: this.fb.array([]),
    });
  }

  get empregadores(): FormArray {
    return this.form.get('empregadores') as FormArray;
  }

  get enderecoGroup(): FormGroup {
    return this.form.get('endereco') as FormGroup;
  }

  adicionarEmpregador(): void {
    if (this.empregadores.length < 3) {
      this.empregadores.push(
        this.fb.group({
          nome: ['', Validators.required],
          rendimento: [null, [Validators.required, Validators.min(0)]],
        })
      );
    }
  }

  removerEmpregador(index: number): void {
    this.empregadores.removeAt(index);
  }

  buscarCep(): void {
    const cep = (this.enderecoGroup.get('cep')?.value as string)?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;
    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.enderecoGroup.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          });
        }
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erroApi = null;
    const dados: Cliente = this.form.value as Cliente;
    const usuario = this.authService.usuarioLogado();
    dados.usuarioId = usuario?.id;

    const operacao =
      this.isEdicao && this.clienteId != null
        ? this.clienteService.atualizar(this.clienteId, dados)
        : this.clienteService.cadastrar(dados);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdicao ? 'Dados atualizados com sucesso!' : 'Cadastro realizado com sucesso!',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/pedidos']);
      },
      error: (err) => {
        this.salvando = false;
        this.erroApi = err.error?.mensagem || 'Erro ao salvar dados.';
      },
    });
  }
}
