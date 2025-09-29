import { Component } from '@angular/core';
import { StrokeEditor } from '../../components/drawing/stroke-editor/stroke-editor';
import { LayersNavigator } from '../../components/drawing/layers-navigator/layers-navigator';
import { Layers } from '../../components/drawing/layers/layers';
import { Navigator } from '../../components/drawing/navigator/navigator';

@Component({
  selector: 'app-drawing-editor',
  imports: [StrokeEditor, LayersNavigator, Layers, Navigator],
  templateUrl: './drawing-editor.html',
  styleUrl: './drawing-editor.scss',
})
export class DrawingEditor {}
