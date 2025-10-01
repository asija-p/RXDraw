import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HistoryState, StrokeState } from './drawing.reducer';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { layer } from '@fortawesome/fontawesome-svg-core';
import { Layer } from '../models/layer';

export const selectStrokeState = createFeatureSelector<StrokeState>('stroke');
export const selectStrokeColor = createSelector(selectStrokeState, (state) => state.color);
export const selectStrokeSize = createSelector(selectStrokeState, (state) => state.size);
export const selectStrokeTool = createSelector(selectStrokeState, (state) => state.tool);

export const selectHistoryState = createFeatureSelector<HistoryState>('history');
export const selectSteps = createSelector(selectHistoryState, (s) => s.steps);
export const selectCursor = createSelector(selectHistoryState, (s) => s.cursor);
