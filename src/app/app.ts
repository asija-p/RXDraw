import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Canvas } from './components/canvas/canvas';
import { StrokeEditor } from './components/stroke-editor/stroke-editor';
import { Navigator } from './components/navigator/navigator';
import { Layers } from './components/layers/layers';

@Component({
  selector: 'app-root',
  imports: [Canvas, StrokeEditor, Navigator, Layers],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('RXDraw');
}
