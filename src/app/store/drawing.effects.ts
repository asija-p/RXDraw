import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, map, filter, concatMap, take } from 'rxjs/operators';
import {
  commitHistoryStep,
  redoHistoryStep,
  reverseLayer,
  saveLayer,
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
      filter((step): step is HistoryStep => !!step),
      map((step) => reverseLayer({ layerId: step.layerId, canvasData: step.before }))
    )
  );

  applyOnRedo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redoHistoryStep),
      withLatestFrom(this.store.select(selectSteps), this.store.select(selectCursor)),
      map(([, steps, cursor]) => steps[cursor]),
      filter((step): step is HistoryStep => !!step),
      map((step) => reverseLayer({ layerId: step.layerId, canvasData: step.after }))
    )
  );
}
