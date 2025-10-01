import { createAction, props } from '@ngrx/store';
import { ToolId } from '../models/tool';
import { Layer } from '../models/layer';
import { Update } from '@ngrx/entity';
import { HistoryStep } from '../models/history-step';
import { Drawing } from '../../../shared/models/drawing';

export const setStrokeColor = createAction(
  '[Stroke] Set Color',
  props<{ color: { r: number; g: number; b: number; a: number } }>()
);
export const setStrokeSize = createAction('[Stroke] Set Size', props<{ size: number }>());
export const setStrokeTool = createAction('[Stroke] Set Tool', props<{ tool: ToolId }>());

export const commitHistoryStep = createAction(
  '[Canvas] Commit Step',
  props<{ step: HistoryStep }>()
);
export const undoHistoryStep = createAction('[Canvas] Undo Step');
export const redoHistoryStep = createAction('[Canvas] Redo Step');
