import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorChromeModule } from 'ngx-color/chrome';
import {
  redoHistoryStep,
  setStrokeColor,
  setStrokeSize,
  setStrokeTool,
  undoHistoryStep,
} from '../../store/drawing.actions';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { Tool, ToolId } from '../../models/tool';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPaintBrush,
  faEraser,
  faFillDrip,
  faHighlighter,
  faFeather,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stroke-editor',
  imports: [ColorChromeModule, MatSliderModule, CommonModule, FontAwesomeModule],
  templateUrl: './stroke-editor.html',
  styleUrl: './stroke-editor.scss',
})
export class StrokeEditor {
  strokeColor = '#000000';
  strokeOpacity = '1';
  strokeSize = 5;
  activeTool = 'brush';

  sizes = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];

  tools: Tool[] = [
    { id: 'brush', icon: faPaintBrush },
    { id: 'eraser', icon: faEraser },
    { id: 'bucket', icon: faFillDrip },
    { id: 'marker', icon: faHighlighter },
    { id: 'quill', icon: faFeather },
  ];

  constructor(private store: Store) {}

  onColorChange(event: any) {
    const rgba = event.color.rgb;
    this.store.dispatch(setStrokeColor({ color: rgba }));
  }

  selectSize(size: number) {
    this.strokeSize = size;
    this.store.dispatch(setStrokeSize({ size }));
  }

  selectTool(toolId: ToolId) {
    this.activeTool = toolId;
    this.store.dispatch(setStrokeTool({ tool: toolId }));
  }

  undo() {
    this.store.dispatch(undoHistoryStep());
  }

  redo() {
    this.store.dispatch(redoHistoryStep());
  }
}
