import { inject, Injectable } from '@angular/core';
import { LayersService } from '../services/layers-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { loadLayers, loadLayersFailure, loadLayersSuccess } from './layers.actions';

@Injectable()
export class LayersEffects {
  constructor(private layersService: LayersService) {}

  private actions$ = inject(Actions);
  private store = inject(Store);

  loadLayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLayers),
      switchMap(({ drawingId }) =>
        this.layersService.getAll(drawingId).pipe(
          map((layers) => loadLayersSuccess({ layers: layers })),
          catchError((err) => of(loadLayersFailure({ error: String(err?.message ?? err) })))
        )
      )
    )
  );
}
