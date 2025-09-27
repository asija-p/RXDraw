import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Canvas } from './components/canvas/canvas';
import { StrokeEditor } from './components/stroke-editor/stroke-editor';
import { Navigator } from './components/navigator/navigator';
import { LayersNavigator } from './components/layers-navigator/layers-navigator';
import { Layers } from './components/layers/layers';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
