import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('canvas') public canvas!: ElementRef<HTMLCanvasElement>;

  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D | undefined;

  public ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d')!;

    if (!this.cx) {
      throw new Error('Could not get canvas context');
    }

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent<MouseEvent>(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent<MouseEvent>(canvasEl, 'mousemove').pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number; y: number }, currentPos: { x: number; y: number }) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);

      this.cx.lineTo(currentPos.x, currentPos.y);

      this.cx.stroke();
    }
  }
}
