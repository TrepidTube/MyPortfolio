import { Component, OnDestroy, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  image: string;
  tech: string[];
  demo?: string;
  code?: string;
  codePantalla?: string;
  codeController?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnDestroy, AfterViewInit {
  projects: Project[] = [
    {
      title: 'Baseball Score',
      description: 'Proyecto de contador de puntuación de baseball.',
      image: 'assets/proyectos/baseball.png',
      tech: ['TypeScript', 'Angular', 'Electron'],
      code: 'https://github.com/TrepidTube/Baseball-score'
    },
    {
      title: 'Football Score',
      description: 'Contador de puntuación para partidos de fútbol americano.',
      image: 'assets/proyectos/football.jpg',
      tech: ['TypeScript', 'Angular', 'Electron'],
      code: 'https://github.com/TrepidTube/Football-Score-'
    },
    {
      title: 'Soccer Score',
      description: 'Contador de puntuación para partidos de fútbol.',
      image: 'assets/proyectos/soccer.jpg',
      tech: ['TypeScript', 'Angular', 'Electron'],
      code: 'https://github.com/TrepidTube/Soccer-Score-'
    },
    {
      title: 'Cronómetro (Pantalla + Controller)',
      description: 'Aplicación de cronómetro/temporizador compuesta por dos módulos: Pantalla y Controller. Controller gestiona la lógica y Pantalla muestra la interfaz visual.',
      image: 'assets/proyectos/cronometro.jpeg',
      tech: ['Java'],
      code: '',
      codePantalla: 'https://github.com/TrepidTube/CronometroPantalla',
      codeController: 'https://github.com/TrepidTube/CronometroController'
    }
  ];

  current = 0;
  autoplayInterval: any;
  paused = false;
  touchStartX = 0;
  touchEndX = 0;
  bounce = false;

  constructor(private el: ElementRef) {
    this.startAutoplay();
  }

  ngAfterViewInit() {
    // Accesibilidad: focus automático
    const track = this.el.nativeElement.querySelector('.carousel-track');
    if (track) {
      track.setAttribute('tabindex', '0');
    }
  }

  get prevIndex() {
    return (this.current - 1 + this.projects.length) % this.projects.length;
  }
  get nextIndex() {
    return (this.current + 1) % this.projects.length;
  }

  // Swipe soporte móvil
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    if (this.touchEndX < this.touchStartX - 40) {
      this.next();
    } else if (this.touchEndX > this.touchStartX + 40) {
      this.prev();
    } else {
      this.bounceEffect();
    }
  }

  // Navegación por teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  prev() {
    this.current = this.prevIndex;
    this.restartAutoplay();
  }

  next() {
    this.current = this.nextIndex;
    this.restartAutoplay();
  }

  goTo(i: number) {
    if (i === this.current) {
      this.bounceEffect();
      return;
    }
    this.current = i;
    this.restartAutoplay();
  }

  bounceEffect() {
    this.bounce = true;
    setTimeout(() => this.bounce = false, 350);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, 4000);
  }

  pauseAutoplay() {
    this.paused = true;
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  restartAutoplay() {
    if (this.paused) {
      this.paused = false;
    }
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    this.startAutoplay();
  }

  ngOnDestroy() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}
