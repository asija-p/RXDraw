import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StrokeState } from './drawing.reducer';

export const selectStrokeState = createFeatureSelector<StrokeState>('stroke');

export const selectStrokeColor = createSelector(selectStrokeState, (state) => state.color);
