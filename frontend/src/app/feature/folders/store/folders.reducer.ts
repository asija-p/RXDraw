import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Folder } from '../models/folder';
import { createReducer, on } from '@ngrx/store';
import * as Actions from './folders.actions';
import {
  createFolder,
  createFolderSuccess,
  deleteFolderFailure,
  deleteFolderSuccess,
  loadFoldersFailure,
  loadFoldersSuccess,
  openFolder,
  updateFolderSuccess,
} from './folders.actions';

export interface FoldersState extends EntityState<Folder> {
  openedFolderId: string | null;
}

const adapter = createEntityAdapter<Folder>();

export const initialState: FoldersState = adapter.getInitialState({
  openedFolderId: null,
});

export const foldersReducer = createReducer(
  initialState,
  on(loadFoldersSuccess, (state, { folders }) => adapter.setAll(folders, state)),
  on(loadFoldersFailure, (s, { error }) => ({ ...s, loading: false, error })),
  on(createFolderSuccess, (state, { folder }) => adapter.addOne(folder, state)),
  on(deleteFolderSuccess, (state, { folderId }) => adapter.removeOne(folderId, state)),
  on(openFolder, (state, { folderId }) => {
    return { ...state, openedFolderId: folderId };
  }),
  on(updateFolderSuccess, (state, { folder }) =>
    adapter.updateOne({ id: folder.id, changes: folder }, state)
  )
);
