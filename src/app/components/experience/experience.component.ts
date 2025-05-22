import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  percent: number;
  color: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements AfterViewInit {
  appSkills: Skill[] = [
    { name: 'Java', percent: 65, color: '#007396' },
    { name: 'Node.js', percent: 50, color: '#68a063' },
    { name: 'Git', percent: 55, color: '#f34f29' }
  ];

  webSkills: Skill[] = [
    { name: 'HTML', percent: 60, color: '#e44d26' },
    { name: 'CSS', percent: 55, color: '#1572b6' },
    { name: 'JS', percent: 50, color: '#f7df1e' },
    { name: 'Angular', percent: 45, color: '#dd0031' },
    { name: 'TypeScript', percent: 60, color: '#007acc' }
  ];

  animatedAppPercents: number[] = [0];
  animatedWebPercents: number[] = [0, 0, 0, 0];
  observer!: IntersectionObserver;
  @ViewChild('skillsSection') skillsSection!: ElementRef;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateAppSkills();
          this.animateWebSkills();
        } else {
          this.animatedAppPercents = this.appSkills.map(_ => 0);
          this.animatedWebPercents = this.webSkills.map(_ => 0);
        }
      });
    }, { threshold: 0.5 });
    if (this.skillsSection) {
      this.observer.observe(this.skillsSection.nativeElement);
    }
  }

  animateAppSkills() {
    const duration = 400;
    this.appSkills.forEach((skill, i) => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        this.animatedAppPercents[i] = Math.round(progress * skill.percent);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedAppPercents[i] = skill.percent;
        }
      };
      requestAnimationFrame(animate);
    });
  }

  animateWebSkills() {
    const duration = 400;
    this.webSkills.forEach((skill, i) => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        this.animatedWebPercents[i] = Math.round(progress * skill.percent);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedWebPercents[i] = skill.percent;
        }
      };
      requestAnimationFrame(animate);
    });
  }

  getIconUrl(name: string, color: string): string {
    if (name === 'Java') {
      return 'https://img.icons8.com/?size=100&id=13679&format=png&color=007396';
    }
    const icons: { [key: string]: string } = {
      'Node.js': 'nodedotjs',
      'Git': 'git',
      'HTML': 'html5',
      'CSS': 'css3',
      'JS': 'javascript',
      'Angular': 'angular',
      'TypeScript': 'typescript'
    };
    const icon = icons[name] || 'code';
    return `https://cdn.simpleicons.org/${icon}/${color.replace('#','')}`;
  }
}
