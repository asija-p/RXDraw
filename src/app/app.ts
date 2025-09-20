import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Canvas } from './components/canvas/canvas';
import { StrokeEditor } from './components/stroke-editor/stroke-editor';
import { Navigator } from './components/navigator/navigator';
import { LayersNavigator } from './components/layers-navigator/layers-navigator';
import { Layers } from './components/layers/layers';

@Component({
  selector: 'app-root',
  imports: [StrokeEditor, Navigator, LayersNavigator, Layers],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('RXDraw');
}
