import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutomovelService } from '../../../core/services/automovel.service';

@Component({
  selector: 'app-automoveis-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './automoveis-form.component.html',
  styleUrl: './automoveis-form.component.css',
})
export class AutomoveisFormComponent implements OnInit {
  form!: FormGroup;
  editando = false;
  automovelId?: number;

  constructor(
    private fb: FormBuilder,
    private automovelService: AutomovelService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      matricula: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1900)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      disponivel: [true],
      tipoProprietario: ['EMPRESA', Validators.required],
      nomeProprietario: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.automovelId = +id;
      this.automovelService.buscarPorId(this.automovelId).subscribe({
        next: (auto) => this.form.patchValue(auto),
        error: () => {
          this.snackBar.open('Automóvel não encontrado.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/automoveis']);
        },
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;
    const dados = this.form.value;

    if (this.editando && this.automovelId) {
      this.automovelService.atualizar(this.automovelId, dados).subscribe({
        next: () => {
          this.snackBar.open('Automóvel atualizado!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/automoveis']);
        },
        error: (err) => {
          const msg = err.error?.mensagem || 'Erro ao atualizar.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        },
      });
    } else {
      this.automovelService.cadastrar(dados).subscribe({
        next: () => {
          this.snackBar.open('Automóvel cadastrado!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/automoveis']);
        },
        error: (err) => {
          const msg = err.error?.mensagem || 'Erro ao cadastrar.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        },
      });
    }
  }
}
