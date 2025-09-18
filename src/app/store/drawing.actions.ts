import { createAction, props } from '@ngrx/store';

export const setStrokeColor = createAction('[Stroke] Set Color', props<{ color: string }>());

export const setStrokeSize = createAction('[Stroke] Set Size', props<{ size: number }>());
