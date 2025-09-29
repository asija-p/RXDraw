import { createAction, props } from '@ngrx/store';
import { Folder } from '../models/folder';

export const loadFolders = createAction('[Folders] Load Folders');
export const loadFoldersSuccess = createAction(
  '[Folders] Load Folders Success',
  props<{ folders: Folder[] }>()
);
export const loadFoldersFailure = createAction(
  '[Folders] Load Folders Failure',
  props<{ error: string }>()
);
export const createFolder = createAction(
  '[Folders] Create Folder',
  props<{ name: string; icon?: string }>()
);
export const createFolderSuccess = createAction(
  '[Folders] Create Folder Success',
  props<{ folder: Folder }>()
);
export const createFolderFailure = createAction(
  '[Folders] Create Folder Failure',
  props<{ error: string }>()
);
