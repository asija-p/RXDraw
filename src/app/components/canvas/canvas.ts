import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, merge, pairwise, switchMap, takeUntil } from 'rxjs';
import { selectStrokeColor } from '../../store/drawing.selectors';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('canvas') public canvas!: ElementRef<HTMLCanvasElement>;

  @Input() public width = 700;
  @Input() public height = 700;

  private cx: CanvasRenderingContext2D | undefined;
  strokeColor = '#000000';

  constructor(private store: Store) {
    this.store.select(selectStrokeColor).subscribe((color) => {
      this.strokeColor = color;
    });
  }

  public ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    this.cx = canvasEl.getContext('2d')!;

    if (!this.cx) {
      throw new Error('Could not get canvas context');
    }

    ['touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointermove', 'pointerup'].forEach(
      (ev) => {
        canvasEl.addEventListener(ev, (e) => {
          console.log(ev, e);
        });
      }
    );

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.cx.fillStyle = '#ffffff';
    this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    const mouseDown = merge(
      fromEvent<MouseEvent>(canvasEl, 'mousedown'),
      fromEvent<TouchEvent>(canvasEl, 'touchstart')
    );

    const mouseUp = merge(
      fromEvent<MouseEvent>(window, 'mouseup'),
      fromEvent<MouseEvent>(window, 'mouseleave'),
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
      .subscribe(([prev, curr]: [MouseEvent | TouchEvent, MouseEvent | TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = this.getPos(prev, rect);
        const currPos = this.getPos(curr, rect);
        this.drawOnCanvas(prevPos, currPos);
      });
  }

  private getPos(ev: MouseEvent | TouchEvent, rect: DOMRect) {
    if (ev instanceof MouseEvent) {
      return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
        pressure: (ev as any).pressure ?? 1,
      };
    } else {
      const touch = ev.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        pressure: touch.force ?? 1,
      };
    }
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number; pressure: number },
    currentPos: { x: number; y: number; pressure: number }
  ) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);

      this.cx.lineTo(currentPos.x, currentPos.y);

      const baseWidth = 5;
      this.cx.lineWidth = baseWidth * currentPos.pressure;

      this.cx.strokeStyle = this.strokeColor;
      this.cx.stroke();
    }
  }
}
