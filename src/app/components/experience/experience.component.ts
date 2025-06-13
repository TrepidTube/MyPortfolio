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
    { name: 'C', percent: 75, color: '#00599C' },
    { name: 'C++', percent: 75, color: '#4F97C7' },
    { name: 'C#', percent: 60, color: '#68217A' },
    { name: 'Python', percent: 45, color: '#3776AB' }
  ];

  webSkills: Skill[] = [
    { name: 'HTML', percent: 60, color: '#e44d26' },
    { name: 'CSS', percent: 55, color: '#1572b6' },
    { name: 'JS', percent: 50, color: '#f7df1e' },
    { name: 'Node.js', percent: 50, color: '#68a063' },
    { name: 'Angular', percent: 45, color: '#dd0031' },
    { name: 'TypeScript', percent: 60, color: '#007acc' }
  ];

  dbSkills: Skill[] = [
    { name: 'MySQL', percent: 65, color: '#00758F' },
    { name: 'MongoDB', percent: 45, color: '#47A248' }
  ];

  PMSkills: Skill[] = [
    { name: 'Git', percent: 70, color: '#F05032' },
    { name: 'Jira', percent: 55, color: '#0052cc' },
    { name: 'Apache', percent: 45, color: '#D22128' },
    { name: 'Firebase', percent: 60, color: '#FFCA28' }
  ];

  animatedAppPercents: number[] = [0];
  animatedWebPercents: number[] = [0, 0, 0, 0];
  animatedDbPercents: number[] = [0, 0, 0];
  animatedPMSkills: number[] = [0, 0, 0, 0];
  observer!: IntersectionObserver;
  @ViewChild('skillsSection') skillsSection!: ElementRef;
  private skillsAnimated = false;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.skillsAnimated) {
          this.animateAppSkills();
          this.animateWebSkills();
          this.animateDbSkills();
          this.animatePMSkills();
          this.skillsAnimated = true;
        } else if (!entry.isIntersecting) {
          this.animatedAppPercents = this.appSkills.map(_ => 0);
          this.animatedWebPercents = this.webSkills.map(_ => 0);
          this.animatedDbPercents = this.dbSkills.map(_ => 0);
          this.animatedPMSkills = this.PMSkills.map(_ => 0);
          this.skillsAnimated = false;
        }
      });
    }, { threshold: 0.1 });
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

  animateDbSkills() {
    const duration = 400;
    this.dbSkills.forEach((skill, i) => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        this.animatedDbPercents[i] = Math.round(progress * skill.percent);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedDbPercents[i] = skill.percent;
        }
      };
      requestAnimationFrame(animate);
    });
  }

  animatePMSkills() {
    const duration = 400;
    this.PMSkills.forEach((skill, i) => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        this.animatedPMSkills[i] = Math.round(progress * skill.percent);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedPMSkills[i] = skill.percent;
        }
      };
      requestAnimationFrame(animate);
    });
  }

  getIconUrl(name: string, color: string): string {
    const icons: { [key: string]: string } = {
      'Java': 'java',
      'C': 'c',
      'C++': 'cplusplus',
      'C#': 'csharp',
      'Python': 'python',
      'Git': 'git',
      'Node.js': 'nodejs',
      'HTML': 'html5',
      'CSS': 'css3',
      'JS': 'javascript',
      'Angular': 'angularjs',
      'TypeScript': 'typescript',
      'MySQL': 'mysql',
      'MongoDB': 'mongodb',
      'Apache': 'apache',
      'Firebase': 'firebase',
      'Jira': 'jira'
    };
    const icon = icons[name];
    if (icon) {
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`;
    }
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/code/code-original.svg';
  }
}
