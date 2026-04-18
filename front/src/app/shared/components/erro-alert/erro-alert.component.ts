import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-erro-alert',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './erro-alert.component.html',
  styleUrl: './erro-alert.component.css',
})
export class ErroAlertComponent {
  @Input() mensagem: string | null = null;
}
