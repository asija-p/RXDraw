import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, fromEvent, merge, pairwise, switchMap, takeUntil } from 'rxjs';
import {
  selectStrokeColor,
  selectStrokeSize,
  selectStrokeTool,
} from '../../store/drawing.selectors';
import { Stroke } from '../../models/stroke';

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

  private snapshots: ImageData[] = [];
  private snapshotIndex = -1;
  private maxSnapshots = 20;
  private isDrawing = false;

  private currentStroke: Stroke = {
    color: 'rgba(0,0,0,1)',
    size: 5,
    tool: 'brush',
  };

  constructor(private store: Store) {
    combineLatest([
      this.store.select(selectStrokeColor),
      this.store.select(selectStrokeSize),
      this.store.select(selectStrokeTool),
    ]).subscribe(([color, size, tool]) => {
      this.currentStroke = {
        color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        size,
        tool,
      };
    });
  }

  public ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    this.cx = canvasEl.getContext('2d')!;

    if (!this.cx) {
      throw new Error('Could not get canvas context');
    }

    /*
    ['touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointermove', 'pointerup'].forEach(
      (ev) => {
        canvasEl.addEventListener(ev, (e) => {
          console.log(ev, e);
        });
      }
    );
    */

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.cx.fillStyle = '#ffffff';
    this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    this.saveSnapshot();

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
        switchMap(() => {
          this.isDrawing = true;
          return mouseMove.pipe(takeUntil(mouseUp), pairwise());
        })
      )
      .subscribe(([prev, curr]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = this.getPos(prev, rect);
        const currPos = this.getPos(curr, rect);
        this.drawOnCanvas(prevPos, currPos);
      });

    mouseUp.subscribe(() => {
      if (this.isDrawing) {
        this.saveSnapshot();
        this.isDrawing = false;
      }
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
    if (!this.cx) return;

    this.cx.beginPath();
    this.cx.moveTo(prevPos.x, prevPos.y);
    this.cx.lineTo(currentPos.x, currentPos.y);

    this.cx.lineWidth = this.currentStroke.size * currentPos.pressure;
    this.cx.strokeStyle = this.currentStroke.color;
    this.cx.stroke();
  }

  private saveSnapshot() {
    if (!this.cx) return;

    const data = this.cx.getImageData(0, 0, this.width, this.height);

    this.snapshots = this.snapshots.slice(0, this.snapshotIndex + 1);

    if (this.snapshots.length >= this.maxSnapshots) {
      this.snapshots.shift();
      this.snapshotIndex--;
    }

    this.snapshots.push(data);
    this.snapshotIndex++;

    console.log('Saved snapshot', this.snapshotIndex, 'total:', this.snapshots.length);
  }

  undo() {
    if (!this.cx) return;
    console.log('Undo clicked', this.snapshotIndex, this.snapshots.length);

    if (this.snapshotIndex > 0) {
      this.snapshotIndex--;
      console.log('Reverting to', this.snapshotIndex);
      this.cx.putImageData(this.snapshots[this.snapshotIndex], 0, 0);
    }
  }

  redo() {
    if (!this.cx) return;
    console.log('Redo clicked', this.snapshotIndex, this.snapshots.length);

    if (this.snapshotIndex < this.snapshots.length - 1) {
      this.snapshotIndex++;
      console.log('Advancing to', this.snapshotIndex);
      this.cx.putImageData(this.snapshots[this.snapshotIndex], 0, 0);
    }
  }
}
