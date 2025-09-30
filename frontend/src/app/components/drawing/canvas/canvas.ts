import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  fromEvent,
  merge,
  pairwise,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  selectStrokeColor,
  selectStrokeSize,
  selectStrokeTool,
} from '../../../feature/studio/store/drawing.selectors';
import { Stroke } from '../../../feature/studio/models/stroke';

import { CommonModule } from '@angular/common';
import { Layers } from '../layers/layers';
import { commitHistoryStep, saveLayer } from '../../../feature/studio/store/drawing.actions';

@Component({
  selector: 'app-canvas',
  imports: [CommonModule],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas implements AfterViewInit {
  @ViewChild('canvas') public canvas!: ElementRef<HTMLCanvasElement>;
  @Input() public width = 700;
  @Input() public height = 700;

  @Input() layerId!: string;
  @Input() visible = true;
  @Input() opacity = 1;
  @Input() zIndex = 0;
  @Input() canvasData: string = '';
  @Input() active = false;

  private cx?: CanvasRenderingContext2D;
  private isDrawing = false;
  private preStrokeData?: string;

  private currentStroke: Stroke = {
    color: 'rgba(0,0,0,1)',
    size: 5,
    tool: 'brush',
  };
  private drawSub?: Subscription;

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
      console.log(this.currentStroke.color);
    });

    /*
    this.store.select(selectCurrentSnapshot).subscribe((snapshot) => {
      if (snapshot && this.cx) {
        const img = new Image();
        img.src = snapshot;
        img.onload = () => {
          this.cx!.clearRect(0, 0, this.width, this.height);
          this.cx!.drawImage(img, 0, 0, this.width, this.height);
        };
      }
    });
    */
  }

  ngOnDestroy() {
    this.drawSub?.unsubscribe();
  }

  ngOnChanges(ch: SimpleChanges) {
    if (!this.cx) return;
    if (ch['canvasData']?.currentValue) {
      this.paintFromDataUrl();
    }

    if (ch['active'] && this.cx) {
      // active turned on -> start capturing
      if (this.active && !this.drawSub) {
        this.drawSub = this.captureEvents(this.canvas.nativeElement);
      }
      // active turned off -> stop capturing
      if (!this.active && this.drawSub) {
        this.drawSub.unsubscribe();
        this.drawSub = undefined;
        this.isDrawing = false;
      }
    }
  }

  public ngAfterViewInit(): void {
    const canvasEl = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d')!;
    if (!this.cx) throw new Error('Could not get canvas context');
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx.lineCap = 'round';

    /*    this.cx.lineCap = 'round';
    this.cx.fillStyle = '#ffffff';
    this.cx.fillRect(0, 0, this.width, this.height);

    this.saveSnapshot();*/

    this.paintFromDataUrl();

    if (this.active) {
      this.drawSub = this.captureEvents(canvasEl);
    }
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

    const draw$ = mouseDown
      .pipe(
        switchMap(() => {
          this.preStrokeData = this.canvas.nativeElement.toDataURL('image/png');
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

    const up$ = mouseUp.subscribe(() => {
      if (this.isDrawing) {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        const after = this.canvas.nativeElement.toDataURL('image/png');
        const before = this.preStrokeData ?? this.canvasData;
        this.preStrokeData = undefined;

        this.store.dispatch(saveLayer({ layerId: this.layerId, canvasData: after }));

        if (before && after && before !== after) {
          console.log('evo me');
          this.store.dispatch(
            commitHistoryStep({
              step: { layerId: this.layerId, op: 'paint', before, after },
            })
          );
        }
      }
    });

    return new Subscription(() => {
      draw$.unsubscribe();
      up$.unsubscribe();
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

  private drawOnCanvas(prevPos: any, currentPos: any) {
    if (!this.cx) return;
    this.cx.beginPath();
    this.cx.moveTo(prevPos.x, prevPos.y);
    this.cx.lineTo(currentPos.x, currentPos.y);
    this.cx.lineWidth = this.currentStroke.size * currentPos.pressure;
    this.cx.strokeStyle = this.currentStroke.color;
    this.cx.stroke();
  }

  private saveLayer() {
    if (!this.cx) return;

    const dataUrl = this.canvas.nativeElement.toDataURL('image/png');

    this.store.dispatch(saveLayer({ layerId: this.layerId, canvasData: dataUrl }));
  }

  private paintFromDataUrl() {
    if (!this.cx || !this.canvasData) return;
    const img = new Image();
    img.src = this.canvasData;
    img.onload = () => {
      this.cx!.clearRect(0, 0, this.width, this.height);
      this.cx!.drawImage(img, 0, 0, this.width, this.height);
    };
  }
}
