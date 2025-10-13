import { inject, Injectable } from '@angular/core';
import { LayersService } from '../services/layers-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, forkJoin, map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  loadLayers,
  loadLayersFailure,
  loadLayersSuccess,
  saveLayersFailure,
  saveLayersRequested,
  saveLayersSuccess,
} from './layers.actions';
import { selectLayers } from './layers.selectors';
import { CreateLayerDto } from '../models/create-layer.dto';

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

  saveLayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveLayersRequested),
      withLatestFrom(this.store.select(selectLayers)),
      switchMap(([{ drawingId }, layersInState]) => {
        const layerDtos: CreateLayerDto[] = (layersInState ?? []).map((l: any) => ({
          name: l.name ?? 'Layer',
          zIndex: l.zIndex,
          visible: l.visible,
          opacity: l.opacity,
          canvasData: l.canvasData,
          drawingId,
        }));

        if (!layerDtos.length) {
          return of(saveLayersSuccess({ drawingId }));
        }

        return forkJoin(layerDtos.map((d) => this.layersService.create(d))).pipe(
          map(() => saveLayersSuccess({ drawingId })),
          catchError((err) => of(saveLayersFailure({ error: String(err?.message ?? err) })))
        );
      })
    )
  );
}
