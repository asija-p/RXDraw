import { createAction, props } from '@ngrx/store';
import { ToolId } from '../models/tool';
import { Layer } from '../models/layer';
import { Update } from '@ngrx/entity';
import { Snapshot } from '../models/snapshot';

export const setStrokeColor = createAction(
  '[Stroke] Set Color',
  props<{ color: { r: number; g: number; b: number; a: number } }>()
);
export const setStrokeSize = createAction('[Stroke] Set Size', props<{ size: number }>());
export const setStrokeTool = createAction('[Stroke] Set Tool', props<{ tool: ToolId }>());

export const addSnapshot = createAction('[Canvas] Add Snapshot', props<{ snapshot: Snapshot }>());
export const undoSnapshot = createAction('[Canvas] Undo Snapshot');
export const redoSnapshot = createAction('[Canvas] Redo Snapshot');

export const addLayer = createAction('[Layers] Add Layer', props<{ layer: Layer }>());
export const removeLayer = createAction('[Layers] Remove Layer', props<{ layerId: string }>());
export const setActiveLayer = createAction(
  '[Layers] Set Active Layer',
  props<{ selectedLayerId: string }>()
);
export const setLayerVisibility = createAction(
  '[Layers] Set Layer Visibility',
  props<{ layerId: string; visible: boolean }>()
);
export const setLayerOpacity = createAction(
  '[Layers] Set Opacity',
  props<{ layerId: string; opacity: number }>() // 0..1
);
export const reorderLayers = createAction(
  '[Layers] Reorder Layers',
  props<{ orderedIds: string[] }>()
);

export const saveLayer = createAction(
  '[Layers] Save Layer',
  props<{ layerId: string; canvasData: string }>()
);
