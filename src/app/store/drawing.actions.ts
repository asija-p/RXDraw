import { createAction, props } from '@ngrx/store';
import { ToolId } from '../models/tool';

export const setStrokeColor = createAction(
  '[Stroke] Set Color',
  props<{ color: { r: number; g: number; b: number; a: number } }>()
);

export const setStrokeSize = createAction('[Stroke] Set Size', props<{ size: number }>());

export const setStrokeTool = createAction('[Stroke] Set Tool', props<{ tool: ToolId }>());
