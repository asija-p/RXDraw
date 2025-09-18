import { createAction, props } from '@ngrx/store';

export const setStrokeColor = createAction('[Stroke] Set Color', props<{ color: string }>());

export const setStrokeSize = createAction('[Stroke] Set Size', props<{ size: number }>());

export const setTool = createAction('[Stroke] Set Tool', props<{ tool: 'brush' | 'eraser' }>());
