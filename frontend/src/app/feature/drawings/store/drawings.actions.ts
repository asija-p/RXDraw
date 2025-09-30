import { createAction, props } from '@ngrx/store';
import { Drawing } from '../../../shared/models/drawing';

export const loadDrawings = createAction(
  '[Drawings] Load Drawings',
  props<{ userId: string; folderId: string }>()
);
export const loadDrawingsSuccess = createAction(
  '[Drawings] Load Drawings Success',
  props<{ drawings: Drawing[] }>()
);
export const loadDrawingsFailure = createAction(
  '[Drawings] Load Drawings Failure',
  props<{ error: string }>()
);
export const setDrawingDimensions = createAction(
  '[Drawing] Set Drawing Dimensions',
  props<{ height: number; width: number }>()
);
export const saveDrawingRequested = createAction(
  '[Studio] Save Drawing Requested',
  props<{ name: string; folderId: string | null }>()
);
export const saveDrawingSuccess = createAction(
  '[Studio] Save Drawing Success',
  props<{ drawing: Drawing }>()
);
export const saveDrawingFailure = createAction(
  '[Studio] Save Drawing Failure',
  props<{ error: unknown }>()
);
