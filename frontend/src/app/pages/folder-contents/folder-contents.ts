import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectDrawingsList,
  selectDrawingsLoading,
} from '../../feature/drawings/store/drawings.selectors';
import {
  clearDrawings,
  deleteDrawing,
  loadDrawings,
  updateDrawing,
} from '../../feature/drawings/store/drawings.actions';
import {
  selectFolderById,
  selectOpenedFolder,
  selectOpenedFolderId,
} from '../../feature/folders/store/folders.selectors';
import { combineLatest, filter, firstValueFrom, Observable, take, takeLast } from 'rxjs';
import { Drawing } from '../../shared/models/drawing';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Folder } from '../../feature/folders/models/folder';
import { selectUserId } from '../../core/auth/store/auth.selectors';
import { deleteFolder, updateFolder } from '../../feature/folders/store/folders.actions';
import { DesignFolder } from '../../components/folders/design-folder/design-folder';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-folder-contents',
  imports: [
    RouterLink,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    FontAwesomeModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './folder-contents.html',
  styleUrl: './folder-contents.scss',
})
export class FolderContents {
  drawings$: Observable<Drawing[]>;
  loading$: Observable<boolean>;
  openedFolder$!: Observable<Folder | undefined>;
  trackById = (_: number, d: Drawing) => d.id;
  dialog: any;
  faTrash = faTrash;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.drawings$ = this.store.select(selectDrawingsList);
    this.loading$ = this.store.select(selectDrawingsLoading);
  }

  async ngOnInit() {
    this.store.dispatch(clearDrawings());

    const folderId = this.route.snapshot.paramMap.get('id');
    if (!folderId) return;

    this.openedFolder$ = this.store.select(selectFolderById(folderId));

    const userId = await firstValueFrom(
      this.store.select(selectUserId).pipe(
        filter((id): id is string => !!id),
        take(1)
      )
    );

    console.log(userId + ' ' + folderId);
    this.store.dispatch(loadDrawings({ userId, folderId }));
  }

  onDelete(id: string) {
    this.store.dispatch(deleteDrawing({ id }));
  }

  editingId: string | null = null;
  editValue = '';

  startEdit(d: Drawing) {
    this.editingId = d.id;
    this.editValue = d.name ?? '';
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('input.name-input');
      el?.focus();
      el?.select();
    }, 0);
  }

  commitEdit(d: Drawing) {
    const newName = (this.editValue ?? '').trim();
    this.editingId = null;
    if (!newName || newName === d.name) return;
    this.store.dispatch(updateDrawing({ id: d.id, changes: { name: newName } })); // ✅
  }

  cancelEdit() {
    this.editingId = null;
  }
}
