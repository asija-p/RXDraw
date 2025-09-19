import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigator',
  imports: [],
  templateUrl: './navigator.html',
  styleUrl: './navigator.scss',
})
export class Navigator {
  @ViewChild('previewCanvas') previewCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const ctx = this.previewCanvas.nativeElement.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      0,
      0,
      this.previewCanvas.nativeElement.width,
      this.previewCanvas.nativeElement.height
    );
  }
}
