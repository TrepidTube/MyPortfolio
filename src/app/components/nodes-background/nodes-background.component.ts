import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nodes-background',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #nodesCanvas class="nodes-canvas" (click)="onCanvasClick($event)"></canvas>
  <div *ngIf="showSecretToast" class="secret-toast">
    Jehová es mi luz y mi salvación; ¿de quién temeré?, Salmos 27
  </div>`,
  styleUrls: ['./nodes-background.component.scss']
})
export class NodesBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nodesCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private nodes: { x: number, y: number, z: number, vx: number, vy: number, vz: number, isSecret?: boolean }[] = [];
  private nodeCount = 32;
  private maxDist3D = 200;
  private animationId: any;
  private breathing = 0;
  private breathingSpeed = 0.9;
  private cameraZ = 400;
  private perspective = 800;
  private minZ = 40;
  private maxZ = this.cameraZ - 40;
  private lastFrame = 0;
  private frameInterval = 1000 / 30;
  showSecretToast = false;

  ngOnInit() {
    setTimeout(() => this.initCanvas(), 0);
    window.addEventListener('resize', this.handleResize);
  }

  ngAfterViewInit() {
    this.initCanvas();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    cancelAnimationFrame(this.animationId);
  }

  handleResize = () => {
    this.initCanvas();
  };

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d')!;
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: (Math.random() - 0.5) * this.width * 0.65,
        y: (Math.random() - 0.5) * this.height * 0.65,
        z: this.minZ + Math.random() * (this.maxZ - this.minZ),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4
      });
    }
    // Nodo secreto azul muy claro
    this.nodes.push({
      x: (Math.random() - 0.5) * this.width * 0.65,
      y: (Math.random() - 0.5) * this.height * 0.65,
      z: this.minZ + Math.random() * (this.maxZ - this.minZ),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
      isSecret: true
    });
    this.breathing = 0;
    this.animate();
  }

  private project3D(x: number, y: number, z: number) {
    const safeZ = Math.max(this.minZ, Math.min(z, this.maxZ));
    const scale = this.perspective / (this.cameraZ - safeZ);
    return {
      x: this.width / 2 + x * scale,
      y: this.height / 2 + y * scale,
      scale
    };
  }

  private animate = (now: number = 0) => {
    if (now - this.lastFrame < this.frameInterval) {
      this.animationId = requestAnimationFrame(this.animate);
      return;
    }
    this.lastFrame = now;
    this.ctx.fillStyle = '#13131c';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.breathing += this.breathingSpeed * 0.02;
    const breath = 0.45 + 0.35 * Math.abs(Math.sin(this.breathing));

    // Dibujar líneas
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dz = this.nodes[i].z - this.nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < this.maxDist3D) {
          const p1 = this.project3D(this.nodes[i].x, this.nodes[i].y, this.nodes[i].z);
          const p2 = this.project3D(this.nodes[j].x, this.nodes[j].y, this.nodes[j].z);
          const alpha = breath * (1 - dist / this.maxDist3D) * 0.85 * (p1.scale + p2.scale) / 2;
          this.ctx.save();
          this.ctx.globalAlpha = alpha;
          this.ctx.strokeStyle = '#fff';
          this.ctx.lineWidth = 1.5 + 1.5 * breath * ((p1.scale + p2.scale) / 2);
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }

    // Dibujar nodos
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z);
      this.ctx.save();
      this.ctx.globalAlpha = (0.7 + 0.3 * breath) * p.scale;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, (3.5 + 2.5 * breath) * p.scale, 0, 2 * Math.PI);
      if (node.isSecret) {
        this.ctx.fillStyle = '#e6f7ff'; // azul muy, muy claro
        this.ctx.shadowColor = '#e6f7ff';
      } else {
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = '#fff';
      }
      this.ctx.shadowBlur = 3 * breath * p.scale;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Mover nodos
    for (const node of this.nodes) {
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;
      if (node.x < -this.width * 0.325 || node.x > this.width * 0.325) node.vx *= -1;
      if (node.y < -this.height * 0.325 || node.y > this.height * 0.325) node.vy *= -1;
      if (node.z < this.minZ || node.z > this.maxZ) node.vz *= -1;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  onCanvasClick(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    for (const node of this.nodes) {
      if (!node.isSecret) continue;
      const p = this.project3D(node.x, node.y, node.z);
      const r = 6; // radio aproximado
      if (Math.hypot(mouseX - p.x, mouseY - p.y) < r * p.scale * 1.5) {
        this.showSecretToast = true;
        setTimeout(() => this.showSecretToast = false, 4000);
        break;
      }
    }
  }
} 