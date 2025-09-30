import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DrawingsState } from './drawings.reducer';
import { Drawing } from '../../../shared/models/drawing';

export const selectDrawingsState = createFeatureSelector<DrawingsState>('drawings');

export const selectDrawingsList = createSelector(selectDrawingsState, (state) =>
  state.ids
    .map((id) => state.entities[id])
    .filter((drawing) => drawing != null)
    .map((drawing) => <Drawing>drawing)
);
