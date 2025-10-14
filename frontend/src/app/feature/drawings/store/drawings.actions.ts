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
export const clearDrawings = createAction('[Drawings] Clear Drawings');
export const setDrawingDimensions = createAction(
  '[Drawing] Set Drawing Dimensions',
  props<{ height: number; width: number }>()
);
export const setDrawingName = createAction('[Drawing] Set Drawing Name', props<{ name: string }>());

export const saveDrawingRequested = createAction(
  '[Drawing] Save Drawing Requested',
  props<{ name?: string; folderId?: string | null }>()
);

export const saveDrawingSuccess = createAction(
  '[Drawing] Save Drawing Success',
  props<{ drawing: Drawing }>()
);

export const saveDrawingFailure = createAction(
  '[Drawing] Save Drawing Failure',
  props<{ error: unknown }>()
);

export const saveDrawingProgress = createAction(
  '[Drawing] Save Drawing Progress',
  props<{ message: string }>()
);
export const openDrawingRequested = createAction(
  '[Drawing] Open Drawing Requested',
  props<{ id: string }>()
);
export const openDrawingFailure = createAction(
  '[Drawing] Open Drawing Failure',
  props<{ error: unknown }>()
);
export const openDrawingSuccess = createAction(
  '[Drawing] Open Drawing Success',
  props<{ openedDrawingId: string }>()
);
