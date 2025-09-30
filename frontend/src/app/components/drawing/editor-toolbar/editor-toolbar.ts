import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom, take } from 'rxjs';
import { selectOpenedFolderId } from '../../../feature/folders/store/folders.selectors';
import { CreateDrawingDto } from '../../../feature/drawings/models/create-drawing.dto';
import { DrawingsService } from '../../../feature/drawings/services/drawings-service';
import { MatDialog } from '@angular/material/dialog';
import { SaveDrawing } from '../save-drawing/save-drawing';

@Component({
  selector: 'app-editor-toolbar',
  imports: [],
  templateUrl: './editor-toolbar.html',
  styleUrl: './editor-toolbar.scss',
})
export class EditorToolbar {
  readonly dialog = inject(MatDialog);

  constructor(private store: Store, private drawings: DrawingsService) {}

  async save() {
    this.dialog.open(SaveDrawing);
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
