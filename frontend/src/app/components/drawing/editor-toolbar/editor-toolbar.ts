import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom, take } from 'rxjs';
import { selectOpenedFolderId } from '../../../feature/folders/store/folders.selectors';
import { CreateDrawingDto } from '../../../feature/drawings/models/create-drawing.dto';
import { DrawingsService } from '../../../feature/drawings/services/drawings-service';
import { MatDialog } from '@angular/material/dialog';
import { SaveDrawing } from '../save-drawing/save-drawing';
import { selectZoom } from '../../../feature/studio/store/drawing.selectors';
import { cameraSet } from '../../../feature/studio/store/drawing.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editor-toolbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-toolbar.html',
  styleUrl: './editor-toolbar.scss',
})
export class EditorToolbar {
  readonly dialog = inject(MatDialog);
  zoom$: any;

  constructor(private store: Store, private drawings: DrawingsService) {
    this.zoom$ = this.store.select(selectZoom);
  }

  async save() {
    this.dialog.open(SaveDrawing);
  }

  onZoomSlider(value: number) {
    this.store.dispatch(cameraSet({ zoom: Number(value) }));
  }

  private randomHexColor() {
    return (
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
    );
  }
}
