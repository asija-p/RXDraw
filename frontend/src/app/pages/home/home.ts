import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Folder } from '../../feature/folders/models/folder';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  createFolder,
  deleteFolder,
  loadFolders,
  openFolder,
  updateFolder,
} from '../../feature/folders/store/folders.actions';
import { Store } from '@ngrx/store';
import { selectFoldersList } from '../../feature/folders/store/folders.selectors';
import { filter, Observable, of, take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DesignFolder } from '../../components/folders/design-folder/design-folder';
import { CdkMenuModule } from '@angular/cdk/menu';
import { selectUserId } from '../../core/auth/store/auth.selectors';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    FontAwesomeModule,
    FormsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  folders$: Observable<Folder[]> = of([]);
  userId$: Observable<string | undefined>;
  readonly dialog = inject(MatDialog);
  faTrash = faTrash;

  constructor(private store: Store, private router: Router) {
    this.folders$ = this.store.select(selectFoldersList);
    this.userId$ = this.store.select(selectUserId);
  }

  ngOnInit() {
    this.store
      .select(selectUserId)
      .pipe(
        filter((id): id is string => !!id),
        take(1)
      )
      .subscribe((userId) => {
        console.log(userId);
        this.store.dispatch(loadFolders());
      });
  }

  addFolder() {
    this.dialog.open(DesignFolder);
  }

  onDelete(id: string) {
    this.store.dispatch(deleteFolder({ folderId: id }));
  }

  openFolder(id: string) {
    this.store.dispatch(openFolder({ folderId: id }));
    this.router.navigate(['/', id]);
  }

  editingId: string | null = null;
  editValue = '';

  startEdit(f: Folder) {
    this.editingId = f.id;
    this.editValue = f.name ?? '';
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('input.name-input');
      el?.focus();
      el?.select();
    }, 0);
  }

  commitEdit(f: Folder) {
    const newName = (this.editValue ?? '').trim();
    this.editingId = null;
    if (!newName || newName === f.name) return;
    this.store.dispatch(updateFolder({ id: f.id, changes: { name: newName } }));
  }

  cancelEdit() {
    this.editingId = null;
  }
}
