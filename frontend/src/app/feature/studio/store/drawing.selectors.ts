import { createSelector, createFeatureSelector } from '@ngrx/store';
import { adapter, HistoryState, LayersState, StrokeState, CanvasState } from './drawing.reducer';
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

export const selectLayersState = createFeatureSelector<LayersState>('layers');
export const selectLayers = createSelector(selectLayersState, (layers) =>
  layers.ids
    .map((id) => layers.entities[id])
    .filter((layers) => layers != null)
    .map((layer) => <Layer>layer)
);
export const selectLayerEntities = createSelector(selectLayersState, (s) => s.entities);
export const selectActiveLayerId = createSelector(selectLayersState, (s) => s.selectedLayerId);
export const selectActiveLayer = createSelector(
  selectLayersState,
  selectActiveLayerId,
  (layers, id) => layers.entities[id!]
);

export const selectCanvasState = createFeatureSelector<CanvasState>('canvas');
export const selectCanvasHeight = createSelector(selectCanvasState, (s) => s.height);
export const selectCanvasWidth = createSelector(selectCanvasState, (s) => s.width);
export const selectIsCanvasReady = createSelector(
  selectCanvasState,
  (s) => (s.width ?? 0) > 0 && (s.height ?? 0) > 0
);
