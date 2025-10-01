import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayersState } from './layers.reducer';
import { Layer } from '../../studio/models/layer';

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
