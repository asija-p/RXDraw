import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DrawingsState, DrawingState } from './drawings.reducer';
import { Drawing } from '../../../shared/models/drawing';

export const selectDrawingsState = createFeatureSelector<DrawingsState>('drawings');

export const selectDrawingsList = createSelector(selectDrawingsState, (state) =>
  state.ids
    .map((id) => state.entities[id])
    .filter((drawing) => drawing != null)
    .map((drawing) => <Drawing>drawing)
);

export const selectDrawingState = createFeatureSelector<DrawingState>('drawing');
export const selectDrawingHeight = createSelector(selectDrawingState, (s) => s.height);
export const selectDrawingWidth = createSelector(selectDrawingState, (s) => s.width);
export const selectIsDrawingReady = createSelector(
  selectDrawingState,
  (s) => (s.width ?? 0) > 0 && (s.height ?? 0) > 0
);
