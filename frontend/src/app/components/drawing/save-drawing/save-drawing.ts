import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of, take } from 'rxjs';
import { Folder } from '../../../feature/folders/models/folder';
import { selectFoldersList } from '../../../feature/folders/store/folders.selectors';
import { MatRadioModule } from '@angular/material/radio';
import { DesignFolder } from '../../folders/design-folder/design-folder';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { saveDrawingRequested } from '../../../feature/drawings/store/drawings.actions';

@Component({
  selector: 'app-save-drawing',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
  ],
  templateUrl: './save-drawing.html',
  styleUrl: './save-drawing.scss',
  standalone: true,
})
export class SaveDrawing {
  private dialogRef = inject(MatDialogRef<SaveDrawing>);
  name = '';
  folders$: Observable<Folder[]> = of([]);
  folderId: string | null = null;
  readonly dialog = inject(MatDialog);

  constructor(private store: Store, private actions$: Actions) {
    this.folders$ = this.store.select(selectFoldersList);
  }

  submit() {
    const name = this.name.trim();
    if (!name) return;
    this.store.dispatch(saveDrawingRequested({ name, folderId: this.folderId }));
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  createNewFolder(ev?: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();

    const ref = this.dialog.open(DesignFolder);

    ref.afterClosed().subscribe((res) => {
      if (res?.id) {
        this.folderId = res.id;
      }
    });
  }
}
