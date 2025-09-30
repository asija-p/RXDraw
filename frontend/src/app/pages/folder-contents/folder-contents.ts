import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDrawingsList } from '../../feature/drawings/store/drawings.selectors';
import { loadDrawings } from '../../feature/drawings/store/drawings.actions';
import { selectOpenedFolderId } from '../../feature/folders/store/folders.selectors';
import { filter, firstValueFrom, Observable, take, takeLast } from 'rxjs';
import { Drawing } from '../../shared/models/drawing';

@Component({
  selector: 'app-folder-contents',
  imports: [],
  templateUrl: './folder-contents.html',
  styleUrl: './folder-contents.scss',
})
export class FolderContents {
  private drawings$: Observable<Drawing[]>;

  constructor(private store: Store) {
    this.drawings$ = this.store.select(selectDrawingsList);
  }

  async ngOnInit() {
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
