import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectDrawingsList,
  selectDrawingsLoading,
} from '../../feature/drawings/store/drawings.selectors';
import { clearDrawings, loadDrawings } from '../../feature/drawings/store/drawings.actions';
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

@Component({
  selector: 'app-folder-contents',
  imports: [RouterLink, CommonModule],
  templateUrl: './folder-contents.html',
  styleUrl: './folder-contents.scss',
})
export class FolderContents {
  drawings$: Observable<Drawing[]>;
  loading$: Observable<boolean>;
  openedFolder$!: Observable<Folder | undefined>;
  trackById = (_: number, d: Drawing) => d.id;

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
}
