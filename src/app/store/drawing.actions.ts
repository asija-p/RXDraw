import { createAction, props } from '@ngrx/store';
import { ToolId } from '../models/tool';
import { Layer } from '../models/layer';
import { Update } from '@ngrx/entity';

export const setStrokeColor = createAction(
  '[Stroke] Set Color',
  props<{ color: { r: number; g: number; b: number; a: number } }>()
);
export const setStrokeSize = createAction('[Stroke] Set Size', props<{ size: number }>());
export const setStrokeTool = createAction('[Stroke] Set Tool', props<{ tool: ToolId }>());

export const addSnapshot = createAction('[Canvas] Add Snapshot', props<{ snapshot: string }>());

export const undoSnapshot = createAction('[Canvas] Undo Snapshot');
export const redoSnapshot = createAction('[Canvas] Redo Snapshot');

export const addLayer = createAction('[Layers] Add Layer', props<{ layer: Layer }>());
