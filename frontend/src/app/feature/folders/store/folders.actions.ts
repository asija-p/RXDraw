import { createAction, props } from '@ngrx/store';
import { Folder } from '../models/folder';

export const loadFolders = createAction('[Folders] Load Folders', props<{ userId: string }>());
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

export const deleteFolder = createAction('[Folders] Delete Folder', props<{ folderId: string }>());
export const deleteFolderSuccess = createAction(
  '[Folders] Delete Folder Success',
  props<{ folderId: string }>()
);
export const deleteFolderFailure = createAction(
  '[Folders] Delete Folder Failure',
  props<{ error: string }>()
);

export const openFolder = createAction('[Folders] Open Folder', props<{ folderId: string }>());

export const updateFolder = createAction(
  '[Folders] Update Folder',
  props<{ id: string; changes: Partial<Folder> }>()
);
export const updateFolderSuccess = createAction(
  '[Folders] Update Folder Success',
  props<{ folder: Folder }>()
);
export const updateFolderFailure = createAction(
  '[Folders] Update Folder Failure',
  props<{ error: string }>()
);
