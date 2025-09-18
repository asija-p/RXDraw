import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorChromeModule } from 'ngx-color/chrome';
import { setStrokeColor, setStrokeSize, setTool } from '../../store/drawing.actions';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stroke-editor',
  imports: [ColorChromeModule, MatSliderModule, CommonModule],
  templateUrl: './stroke-editor.html',
  styleUrl: './stroke-editor.scss',
})
export class StrokeEditor {
  strokeColor = '#000000';
  strokeSize = 5;
  activeTool: string = 'brush';

  sizes = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];

  tools: { name: 'brush' | 'eraser'; icon: string }[] = [
    { name: 'brush', icon: '🖌️' },
    { name: 'eraser', icon: '🧽' },
  ];

  constructor(private store: Store) {}

  onColorChange(event: any) {
    const color = event.color.hex;
    this.strokeColor = color;
    this.store.dispatch(setStrokeColor({ color }));
    console.log();
  }

  selectSize(size: number) {
    this.strokeSize = size;
    this.store.dispatch(setStrokeSize({ size }));
  }

  selectTool(tool: 'brush' | 'eraser') {
    this.activeTool = tool;
    this.store.dispatch(setTool({ tool }));
  }
}
