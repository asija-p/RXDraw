import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorChromeModule } from 'ngx-color/chrome';
import {
  redoHistoryStep,
  setStrokeColor,
  setStrokeSize,
  setStrokeTool,
  undoHistoryStep,
} from '../../../feature/drawing/store/drawing.actions';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule, NgFor } from '@angular/common';
import { Tool, ToolId } from '../../../feature/drawing/models/tool';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPaintBrush,
  faEraser,
  faFillDrip,
  faHighlighter,
  faFeather,
} from '@fortawesome/free-solid-svg-icons';
import {
  selectStrokeColor,
  selectStrokeSize,
  selectStrokeTool,
} from '../../../feature/drawing/store/drawing.selectors';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-stroke-editor',
  imports: [ColorChromeModule, MatSliderModule, FontAwesomeModule, CommonModule],
  templateUrl: './stroke-editor.html',
  styleUrl: './stroke-editor.scss',
})
export class StrokeEditor {
  sizes = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];
  paletteSize = 16;
  swatchSlots: ({ r: number; g: number; b: number; a: number } | null)[] = Array(16).fill(null);

  tools: Tool[] = [
    { id: 'brush', icon: faPaintBrush },
    { id: 'eraser', icon: faEraser },
    { id: 'bucket', icon: faFillDrip },
    { id: 'marker', icon: faHighlighter },
    { id: 'quill', icon: faFeather },
  ];

  strokeColor$!: Observable<{ r: number; g: number; b: number; a: number }>;
  strokeSize$!: Observable<number>;
  activeTool$!: Observable<ToolId>;

  constructor(private store: Store) {
    this.strokeColor$ = this.store.select(selectStrokeColor); // {r,g,b,a}
    this.strokeSize$ = this.store.select(selectStrokeSize);
    this.activeTool$ = this.store.select(selectStrokeTool);
  }

  onColorChange(event: any) {
    this.store.dispatch(setStrokeColor({ color: event.color.rgb }));
  }

  selectSize(size: number) {
    this.store.dispatch(setStrokeSize({ size }));
  }

  selectTool(toolId: ToolId) {
    this.store.dispatch(setStrokeTool({ tool: toolId }));
  }

  undo() {
    this.store.dispatch(undoHistoryStep());
  }

  redo() {
    this.store.dispatch(redoHistoryStep());
  }

  menuOpen = false;
  menuX = 0;
  menuY = 0;
  menuIndex: number | null = null;

  openMenu(ev: MouseEvent, i: number) {
    ev.preventDefault();
    this.menuOpen = true;
    this.menuX = ev.clientX;
    this.menuY = ev.clientY;
    this.menuIndex = i;
  }

  closeMenu() {
    this.menuOpen = false;
    this.menuIndex = null;
  }

  saveHere() {
    if (this.menuIndex == null) return;
    this.store
      .select(selectStrokeColor)
      .pipe(take(1))
      .subscribe((c) => {
        this.swatchSlots[this.menuIndex!] = c;
        this.closeMenu();
      });
  }

  clearHere() {
    if (this.menuIndex == null) return;
    this.swatchSlots[this.menuIndex] = null;
    this.closeMenu();
  }

  selectColor(swatch: { r: number; g: number; b: number; a: number } | null) {
    if (!swatch) return;
    this.store.dispatch(setStrokeColor({ color: swatch }));
  }

  rgbaToHex = (c: { r: number; g: number; b: number; a?: number }) => {
    const to2 = (n: number) =>
      Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, '0');
    return `#${to2(c.r)}${to2(c.g)}${to2(c.b)}`; // bez a
  };
}
