import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FoldersState } from './folders.reducer';
import { Folder } from '../models/folder';

export const selectFoldersState = createFeatureSelector<FoldersState>('folders');

export const selectFoldersList = createSelector(selectFoldersState, (state) =>
  state.ids
    .map((id) => state.entities[id])
    .filter((folder) => folder != null)
    .map((folder) => <Folder>folder)
);

export const selectOpenedFolderId = createSelector(
  selectFoldersState,
  (state) => state.openedFolderId
);
