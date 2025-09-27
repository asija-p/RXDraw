import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Canvas } from './components/canvas/canvas';
import { StrokeEditor } from './components/stroke-editor/stroke-editor';
import { Navigator } from './components/navigator/navigator';
import { LayersNavigator } from './components/layers-navigator/layers-navigator';
import { Layers } from './components/layers/layers';
import { NavBar } from './layout/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
