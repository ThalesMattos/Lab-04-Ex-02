import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import { Cliente } from '../../../core/models/cliente.model';
import { ErroAlertComponent } from '../../../shared/components/erro-alert/erro-alert.component';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

interface ViaCepResponse {
  erro?: boolean;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Component({
  selector: 'app-clientes-form',
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
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.css',
})
export class ClientesFormComponent implements OnInit {
  form!: FormGroup;
  estados = ESTADOS;
  isEdicao = false;
  clienteId: number | null = null;
  loading = false;
  salvando = false;
  erroApi: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteId = +id;
      this.isEdicao = true;
      this.carregarCliente(this.clienteId);
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
    const cep = (this.enderecoGroup.get('cep')?.value as string)?.replace(
      /\D/g,
      ''
    );
    if (!cep || cep.length !== 8) return;

    this.http
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe({
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

  carregarCliente(id: number): void {
    this.loading = true;
    this.clienteService.buscarPorId(id).subscribe({
      next: (cliente) => {
        // reconstrói o FormArray antes do patchValue, senão os valores dos empregadores são ignorados
        while (this.empregadores.length) {
          this.empregadores.removeAt(0);
        }
        (cliente.empregadores ?? []).forEach(() => this.adicionarEmpregador());
        this.form.patchValue(cliente);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/clientes']);
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

    const operacao =
      this.isEdicao && this.clienteId != null
        ? this.clienteService.atualizar(this.clienteId, dados)
        : this.clienteService.cadastrar(dados);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdicao
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente cadastrado com sucesso!',
          'Fechar',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.router.navigate(['/clientes']);
      },
      error: (err: HttpErrorResponse) => {
        this.salvando = false;
        this.erroApi =
          err.error?.mensagem ?? 'Ocorreu um erro ao salvar o cliente.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }

  fieldError(control: AbstractControl | null): string {
    if (!control) return '';
    if (control.hasError('required')) return 'Campo obrigatório';
    if (control.hasError('min')) return 'O valor deve ser maior ou igual a zero';
    return '';
  }
}
