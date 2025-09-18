import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fromEvent, merge, pairwise, switchMap, takeUntil } from 'rxjs';

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
    const mouseDown = merge(
      fromEvent<MouseEvent>(canvasEl, 'mousedown'),
      fromEvent<TouchEvent>(canvasEl, 'touchstart')
    );

    const mouseUp = merge(
      fromEvent<MouseEvent>(window, 'mouseup'),
      fromEvent<TouchEvent>(window, 'touchend'),
      fromEvent<TouchEvent>(window, 'touchcancel')
    );

    const mouseMove = merge(
      fromEvent<MouseEvent>(window, 'mousemove'),
      fromEvent<TouchEvent>(window, 'touchmove')
    );

    mouseDown
      .pipe(
        switchMap((e) => {
          return mouseMove.pipe(takeUntil(mouseUp), pairwise());
        })
      )
      .subscribe((res: [MouseEvent | TouchEvent, MouseEvent | TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = this.getPos(res[0], rect);
        const currentPos = this.getPos(res[1], rect);

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private getPos(ev: MouseEvent | TouchEvent, rect: DOMRect) {
    if (ev instanceof MouseEvent) {
      return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
      };
    } else {
      const touch = ev.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
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
