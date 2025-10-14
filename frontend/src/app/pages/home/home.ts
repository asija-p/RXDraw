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
        this.store.dispatch(loadFolders({ userId: '30f396c6-e9ea-4bfd-92b4-06d4d7992495' }));
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

  onRename(folder: Folder) {
    const ref = this.dialog.open(DesignFolder, {
      data: { mode: 'rename', initial: { name: folder.name, icon: folder.icon } },
    });
    ref.afterClosed().subscribe((result?: { name?: string; icon?: string }) => {
      if (!result || !result.name || result.name === folder.name) return;
      this.store.dispatch(
        updateFolder({ id: folder.id, changes: { name: result.name, icon: result.icon } })
      );
    });
  }
}
