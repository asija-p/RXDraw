import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as FolderActions from './folders.actions';
import { FolderService } from '../services/folder-service';
import { deleteFolderFailure, deleteFolderSuccess } from './folders.actions';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../core/auth/store/auth.selectors';

@Injectable()
export class FoldersEffects {
  constructor(private folderService: FolderService) {}

  private actions$ = inject(Actions);
  private store = inject(Store);

  loadFolders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FolderActions.loadFolders),
      switchMap(() =>
        this.folderService.getAll().pipe(
          map((folders) => FolderActions.loadFoldersSuccess({ folders })),
          catchError((err) =>
            of(
              FolderActions.loadFoldersFailure({
                error: err?.error?.message ?? 'Could not load folders',
              })
            )
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FolderActions.createFolder),
      switchMap(({ name, icon }) =>
        this.folderService.add(name, icon).pipe(
          map((folder) => FolderActions.createFolderSuccess({ folder })),
          catchError(() =>
            of(FolderActions.createFolderFailure({ error: 'Could not create folder' }))
          )
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FolderActions.deleteFolder),
      switchMap(({ folderId }) =>
        this.folderService.delete(folderId).pipe(
          map(() => deleteFolderSuccess({ folderId })),
          catchError((err) => of(deleteFolderFailure({ error: 'Could not delete folder' })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FolderActions.updateFolder),
      switchMap(({ id, changes }) =>
        this.folderService.update(id, changes).pipe(
          map((folder) => FolderActions.updateFolderSuccess({ folder })),
          catchError(() =>
            of(FolderActions.updateFolderFailure({ error: 'Could not update folder' }))
          )
        )
      )
    )
  );
}
