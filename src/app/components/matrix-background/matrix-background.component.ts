import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-matrix-background',
  template: `<canvas #matrixCanvas class="matrix-canvas"></canvas>`,
  styleUrls: ['./matrix-background.component.scss']
})
export class MatrixBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matrixCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private columns: number[] = [];
  private fontSize = 22;
  private chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private spotlight = { x: 0, y: 0, r: 180 };
  private mouse = { x: 0, y: 0 };
  private speed = 0.3;

  ngOnInit() {
    setTimeout(() => this.initCanvas(), 0);
    document.addEventListener('mousemove', this.handleGlobalMouseMove);
  }

  ngAfterViewInit() {
    this.spotlight.x = window.innerWidth / 2;
    this.spotlight.y = window.innerHeight / 2;
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.handleGlobalMouseMove);
  }

  handleGlobalMouseMove = (event: MouseEvent) => {
    this.spotlight.x = event.clientX;
    this.spotlight.y = event.clientY;
  };

  @HostListener('window:resize')
  onResize() {
    this.initCanvas();
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d')!;
    this.columns = Array(Math.floor(this.width / this.fontSize)).fill(1);
    this.spotlight.x = this.width / 2;
    this.spotlight.y = this.height / 2;
    this.animate();
  }

  private animate() {
    // 1. Rastro difuminado
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Dibujar las letras Matrix en un buffer
    const buffer = document.createElement('canvas');
    buffer.width = this.width;
    buffer.height = this.height;
    const bctx = buffer.getContext('2d')!;
    bctx.clearRect(0, 0, this.width, this.height);
    bctx.font = `${this.fontSize}px monospace`;
    for (let i = 0; i < this.columns.length; i++) {
      // 3. Tamaño y opacidad variable
      const isHead = true;
      const text = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;
      // Brillo en la letra principal
      if (Math.floor(y / this.fontSize) === Math.floor(this.columns[i])) {
        bctx.font = `bold ${this.fontSize + 4}px monospace`;
        bctx.fillStyle = '#00fff7'; // cyan brillante
        bctx.globalAlpha = 1;
        bctx.fillText(text, x, y);
        bctx.font = `${this.fontSize}px monospace`;
        bctx.globalAlpha = 1;
      }
      // Letras de rastro
      for (let t = 1; t < 16; t++) {
        const trailY = y - t * this.fontSize;
        if (trailY < 0) break;
        const trailAlpha = Math.max(0, 0.18 - t * 0.012);
        bctx.globalAlpha = trailAlpha;
        bctx.fillStyle = '#00b7c2';
        bctx.fillText(this.chars[Math.floor(Math.random() * this.chars.length)], x, trailY);
      }
      bctx.globalAlpha = 1;
      if (y > this.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i] += this.speed;
    }
    bctx.globalAlpha = 1;

    // 4. Spotlight: recortar el buffer con un círculo
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.spotlight.x, this.spotlight.y, this.spotlight.r, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(buffer, 0, 0);
    this.ctx.restore();

    // 5. Gradiente de luz encima (spotlight suave)
    this.ctx.save();
    const grad = this.ctx.createRadialGradient(
      this.spotlight.x, this.spotlight.y, this.spotlight.r * 0.2,
      this.spotlight.x, this.spotlight.y, this.spotlight.r
    );
    grad.addColorStop(0, 'rgba(255,255,255,0.13)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    this.ctx.beginPath();
    this.ctx.arc(this.spotlight.x, this.spotlight.y, this.spotlight.r, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = grad;
    this.ctx.fill();
    this.ctx.restore();

    requestAnimationFrame(() => this.animate());
  }
} 