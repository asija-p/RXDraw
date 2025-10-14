import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom, take } from 'rxjs';
import { selectOpenedFolderId } from '../../../feature/folders/store/folders.selectors';
import { DrawingsService } from '../../../feature/drawings/services/drawings-service';
import { MatDialog } from '@angular/material/dialog';
import { SaveDrawing } from '../save-drawing/save-drawing';
import { selectZoom } from '../../../feature/studio/store/drawing.selectors';
import {
  cameraSet,
  redoHistoryStep,
  undoHistoryStep,
} from '../../../feature/studio/store/drawing.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  selectDrawingsProgress,
  selectOpenedDrawingId,
} from '../../../feature/drawings/store/drawings.selectors';
import { saveDrawingRequested } from '../../../feature/drawings/store/drawings.actions';

@Component({
  selector: 'app-editor-toolbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-toolbar.html',
  styleUrl: './editor-toolbar.scss',
})
export class EditorToolbar {
  readonly dialog = inject(MatDialog);
  @Output() undoClick = new EventEmitter<void>();
  @Output() redoClick = new EventEmitter<void>();
  @Output() saveClick = new EventEmitter<void>();
  @Output() saveAsClick = new EventEmitter<void>();
  zoom$: any;
  progress$: any;
  openedId$: any;

  constructor(private store: Store, private drawings: DrawingsService) {
    this.zoom$ = this.store.select(selectZoom);
    this.progress$ = this.store.select(selectDrawingsProgress);
    this.openedId$ = this.store.select(selectOpenedDrawingId);
  }

  saveAs() {
    this.saveAsClick.emit();
  }
  save() {
    this.saveClick.emit();
  }

  onZoomSlider(value: number) {
    this.store.dispatch(cameraSet({ zoom: Number(value) }));
  }
}
