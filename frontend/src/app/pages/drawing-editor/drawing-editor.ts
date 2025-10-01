import { Component, inject } from '@angular/core';
import { StrokeEditor } from '../../components/drawing/stroke-editor/stroke-editor';
import { LayersNavigator } from '../../components/drawing/layers-navigator/layers-navigator';
import { Layers } from '../../components/drawing/layers/layers';
import { Navigator } from '../../components/drawing/navigator/navigator';
import { EditorToolbar } from '../../components/drawing/editor-toolbar/editor-toolbar';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SettingsDrawing } from '../../components/drawing/settings-drawing/settings-drawing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectIsDrawingReady } from '../../feature/drawings/store/drawings.selectors';
import { ActivatedRoute } from '@angular/router';
import { openDrawingRequested } from '../../feature/drawings/store/drawings.actions';

@Component({
  selector: 'app-drawing-editor',
  imports: [
    StrokeEditor,
    LayersNavigator,
    Navigator,
    EditorToolbar,
    SettingsDrawing,
    MatDialogModule,
    Layers,
    CommonModule,
  ],
  templateUrl: './drawing-editor.html',
  styleUrl: './drawing-editor.scss',
  standalone: true,
})
export class DrawingEditor {
  isCanvasReady$: Observable<boolean>;
  constructor(private store: Store, private route: ActivatedRoute) {
    this.isCanvasReady$ = this.store.select(selectIsDrawingReady);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.dispatch(openDrawingRequested({ id }));
  }

  submit() {}

  cancel() {}
}
