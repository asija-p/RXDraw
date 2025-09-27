import { Component } from '@angular/core';
import { StrokeEditor } from '../../components/stroke-editor/stroke-editor';
import { LayersNavigator } from '../../components/layers-navigator/layers-navigator';
import { Layers } from '../../components/layers/layers';
import { Navigator } from '../../components/navigator/navigator';

@Component({
  selector: 'app-drawing-editor',
  imports: [StrokeEditor, LayersNavigator, Layers, Navigator],
  templateUrl: './drawing-editor.html',
  styleUrl: './drawing-editor.scss',
})
export class DrawingEditor {}
