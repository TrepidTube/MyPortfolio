import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { NodesBackgroundComponent } from './components/nodes-background/nodes-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    ExperienceComponent,
    ProjectsComponent,
    ContactComponent,
    NodesBackgroundComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'portfolio';
  mostrarAviso = false;

  ngOnInit() {
    // Configurar la navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const anchorElement = (e.target as HTMLElement).closest('a');
        const href = anchorElement ? anchorElement.getAttribute('href') : null;
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Configurar el scroll snap
    const container = document.querySelector('.container');
    if (container) {
      container.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            section.classList.add('animate-fade-in');
          }
        });
      });
    }

    this.verificarAncho();
    window.addEventListener('resize', this.verificarAncho.bind(this));
  }

  verificarAncho() {
    this.mostrarAviso = window.innerWidth < 910;
    document.body.style.overflow = this.mostrarAviso ? 'hidden' : '';
  }
}
