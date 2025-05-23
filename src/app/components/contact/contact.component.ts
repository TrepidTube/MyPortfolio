import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  showToast = false;
  toastMessage = '';

  enviarCorreo(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const asunto = (form.querySelector('#asunto') as HTMLInputElement).value;
    const mensaje = (form.querySelector('#mensaje') as HTMLTextAreaElement).value;

    fetch('https://formspree.io/f/xbloeybv', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
    .then(response => {
      if (response.ok) {
        this.toastMessage = 'Mensaje enviado correctamente';
        form.reset();
      } else {
        this.toastMessage = 'Error al enviar el mensaje. Intenta de nuevo más tarde.';
      }
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3500);
    })
    .catch(() => {
      this.toastMessage = 'Error al enviar el mensaje. Intenta de nuevo más tarde.';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3500);
    });
  }
}
