import { Component } from '@angular/core';
import { StrokeEditor } from '../../components/drawing/stroke-editor/stroke-editor';
import { LayersNavigator } from '../../components/drawing/layers-navigator/layers-navigator';
import { Layers } from '../../components/drawing/layers/layers';
import { Navigator } from '../../components/drawing/navigator/navigator';
import { EditorToolbar } from '../../components/drawing/editor-toolbar/editor-toolbar';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SettingsDrawing } from '../../components/drawing/settings-drawing/settings-drawing';

import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  selectIsDrawingReady,
  selectOpenedDrawingId,
} from '../../feature/drawings/store/drawings.selectors';
import { ActivatedRoute } from '@angular/router';
import { openDrawingRequested } from '../../feature/drawings/store/drawings.actions';
import { clearLayers } from '../../feature/layers/store/layers.actions';

@Component({
  selector: 'app-drawing-editor',
  imports: [
    StrokeEditor,
    LayersNavigator,
    Navigator,
    EditorToolbar,
    MatDialogModule,
    Layers,
    CommonModule,
  ],
  templateUrl: './drawing-editor.html',
  styleUrl: './drawing-editor.scss',
  standalone: true,
})
export class DrawingEditor {
  private settingsRef?: MatDialogRef<SettingsDrawing>;
  constructor(private store: Store, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.store.dispatch(openDrawingRequested({ id }));
    } else {
      this.openSettings();
    }
  }

  ngOnDestroy() {
    this.settingsRef?.close();
    this.settingsRef = undefined;
  }

  private openSettings() {
    if (this.settingsRef) return;

    this.settingsRef = this.dialog.open(SettingsDrawing);
  }
}
