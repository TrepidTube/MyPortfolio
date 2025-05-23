import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  mostrarExtra = false;
  cerrando = false;
  fadeBtn = false;

  toggleExtra() {
    if (this.mostrarExtra) {
      this.cerrando = true;
      setTimeout(() => {
        this.mostrarExtra = false;
        this.cerrando = false;
      }, 500); // Duración de la animación
    } else {
      this.fadeBtn = true;
      this.mostrarExtra = true; // Mostrar la info inmediatamente
      setTimeout(() => {
        this.fadeBtn = false; // Ocultar el botón después de la animación
      }, 500);
    }
  }
}
