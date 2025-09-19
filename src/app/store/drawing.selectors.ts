import { createSelector, createFeatureSelector } from '@ngrx/store';
import { adapter, LayersState, SnapshotState, StrokeState } from './drawing.reducer';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const selectStrokeState = createFeatureSelector<StrokeState>('stroke');

export const selectStrokeColor = createSelector(selectStrokeState, (state) => state.color);

export const selectStrokeSize = createSelector(selectStrokeState, (state) => state.size);

export const selectStrokeTool = createSelector(selectStrokeState, (state) => state.tool);

export const selectSnapshotState = createFeatureSelector<SnapshotState>('snapshots');

export const selectSnapshots = createSelector(selectSnapshotState, (state) => state.snapshots);

export const selectSnapshotIndex = createSelector(selectSnapshotState, (state) => state.index);

export const selectCurrentSnapshot = createSelector(
  selectSnapshots,
  selectSnapshotIndex,
  (snaps, index) => snaps[index] ?? null
);

export const selectLayersState = createFeatureSelector<LayersState>('layers');

const { selectAll } = adapter.getSelectors();

export const selectAllLayers = createSelector(selectLayersState, selectAll);
