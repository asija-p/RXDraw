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

export const selectOpenedFolder = createSelector(
  selectFoldersState,
  selectOpenedFolderId,
  (folders, id) => folders.entities[id!]
);

export const selectFolderById = (id: string) =>
  createSelector(selectFoldersState, (folders) => folders.entities[id!] ?? undefined);
