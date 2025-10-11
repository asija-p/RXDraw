import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CameraState, HistoryState, StrokeState } from './drawing.reducer';
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

export const selectCameraState = createFeatureSelector<CameraState>('camera');
export const selectZoom = createSelector(selectCameraState, (state) => state.zoom);
export const selectPan = createSelector(selectCameraState, (state) => ({
  x: state.panX,
  y: state.panY,
}));
export const selectTransform = createSelector(
  selectPan,
  selectZoom,
  ({ x, y }, z) => `translate(${x}px, ${y}px) scale(${z})`
);
