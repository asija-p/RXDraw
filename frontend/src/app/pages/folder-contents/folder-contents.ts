import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectDrawingsList,
  selectDrawingsLoading,
} from '../../feature/drawings/store/drawings.selectors';
import { clearDrawings, loadDrawings } from '../../feature/drawings/store/drawings.actions';
import { selectOpenedFolderId } from '../../feature/folders/store/folders.selectors';
import { filter, firstValueFrom, Observable, take, takeLast } from 'rxjs';
import { Drawing } from '../../shared/models/drawing';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-contents',
  imports: [RouterLink, CommonModule],
  templateUrl: './folder-contents.html',
  styleUrl: './folder-contents.scss',
})
export class FolderContents {
  drawings$: Observable<Drawing[]>;
  loading$: Observable<Boolean>;
  trackById = (_: number, d: Drawing) => d.id;

  constructor(private store: Store, private router: Router) {
    this.drawings$ = this.store.select(selectDrawingsList);
    this.loading$ = this.store.select(selectDrawingsLoading);
  }

  async ngOnInit() {
    this.store.dispatch(clearDrawings());

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId: string = user?.id ?? '';

    const folderId = await firstValueFrom(
      this.store.select(selectOpenedFolderId).pipe(
        filter((id): id is string => !!id),
        take(1)
      )
    );

    this.store.dispatch(loadDrawings({ userId, folderId }));
  }
}
