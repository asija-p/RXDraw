import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, map, filter, concatMap, take } from 'rxjs/operators';
import {
  addLayer,
  commitHistoryStep,
  redoHistoryStep,
  removeLayer,
  reorderLayers,
  reverseLayer,
  saveLayer,
  setLayerOpacity,
  undoHistoryStep,
} from './drawing.actions';
import { selectCursor, selectLayerEntities, selectLayers, selectSteps } from './drawing.selectors';
import { HistoryStep } from '../models/history-step';

@Injectable()
export class HistoryEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  applyOnUndo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undoHistoryStep),
      withLatestFrom(this.store.select(selectSteps), this.store.select(selectCursor)),
      map(([, steps, cursor]) => steps[cursor + 1]),
      filter((s): s is HistoryStep => !!s),
      concatMap((s) => {
        switch (s.op) {
          case 'paint':
            return [reverseLayer({ layerId: s.layerId, canvasData: s.before! })];
          case 'createLayer':
            return [removeLayer({ layerId: s.layerId })];
          case 'deleteLayer':
            return s.layer ? [addLayer({ layer: s.layer })] : [];
          default:
            return [];
        }
      })
    )
  );

  applyOnRedo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redoHistoryStep),
      withLatestFrom(this.store.select(selectSteps), this.store.select(selectCursor)),
      map(([, steps, cursor]) => steps[cursor]),
      filter((s): s is HistoryStep => !!s),
      concatMap((s) => {
        switch (s.op) {
          case 'paint':
            return [reverseLayer({ layerId: s.layerId, canvasData: s.after! })];
          case 'createLayer':
            return s.layer ? [addLayer({ layer: s.layer })] : [];
          case 'deleteLayer':
            return [removeLayer({ layerId: s.layerId })];
          default:
            return [];
        }
      })
    )
  );
}
