import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Folder } from '../models/folder';
import { createReducer, on } from '@ngrx/store';
import * as Actions from './folders.actions';
import {
  createFolder,
  createFolderSuccess,
  deleteFolderFailure,
  deleteFolderSuccess,
  loadFoldersSuccess,
} from './folders.actions';

export interface FoldersState extends EntityState<Folder> {}

const adapter = createEntityAdapter<Folder>();

export const initialState: FoldersState = adapter.getInitialState({});

export const foldersReducer = createReducer(
  initialState,
  on(loadFoldersSuccess, (state, { folders }) => adapter.setAll(folders, state)),
  on(createFolderSuccess, (state, { folder }) => adapter.addOne(folder, state)),
  on(deleteFolderSuccess, (state, { folderId }) => adapter.removeOne(folderId, state)),
  on(deleteFolderFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
