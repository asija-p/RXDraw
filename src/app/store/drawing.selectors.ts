import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SnapshotState, StrokeState } from './drawing.reducer';

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
