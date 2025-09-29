import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Canvas } from './components/drawing/canvas/canvas';
import { StrokeEditor } from './components/drawing/stroke-editor/stroke-editor';
import { Navigator } from './components/drawing/navigator/navigator';
import { LayersNavigator } from './components/drawing/layers-navigator/layers-navigator';
import { Layers } from './components/drawing/layers/layers';
import { NavBar } from './layout/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
