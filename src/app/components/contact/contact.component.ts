import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  showToast = false;
  toastMessage = '';

  constructor(private http: HttpClient) {}

  enviarCorreo(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const asunto = (form.querySelector('#asunto') as HTMLInputElement).value;
    const mensaje = (form.querySelector('#mensaje') as HTMLTextAreaElement).value;
    this.http.post('http://localhost:3001/api/contacto', { asunto, mensaje }).subscribe({
      next: () => {
        this.toastMessage = 'Mensaje enviado correctamente';
        this.showToast = true;
        form.reset();
        setTimeout(() => this.showToast = false, 3500);
      },
      error: () => {
        this.toastMessage = 'Error al enviar el mensaje. Intenta de nuevo más tarde.';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3500);
      }
    });
  }
}
