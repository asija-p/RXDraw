import { createAction, props } from '@ngrx/store';
import { Drawing } from '../models/drawing';

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
