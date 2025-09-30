import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DrawingsService } from '../services/drawings-service';
import * as DrawingsActions from './drawings.actions';

@Injectable()
export class DrawingsEffects {
  constructor(private drawingsService: DrawingsService) {}

  private actions$ = inject(Actions);

  loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DrawingsActions.loadDrawings),
      switchMap(({ userId, folderId }) =>
        this.drawingsService.getAll(userId, folderId).pipe(
          map((drawings) => DrawingsActions.loadDrawingsSuccess({ drawings: drawings })),
          catchError(() => of({ type: 'load error' }))
        )
      )
    )
  );
}
