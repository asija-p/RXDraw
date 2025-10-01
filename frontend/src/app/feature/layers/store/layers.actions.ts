import { createAction, props } from '@ngrx/store';
import { Layer } from '../../studio/models/layer';

export const loadLayers = createAction('[Layers] Load Layers', props<{ drawingId: string }>());
export const loadLayersSuccess = createAction(
  '[Layers] Load Layers Success',
  props<{ layers: Layer[] }>()
);
export const loadLayersFailure = createAction(
  '[Layers] Load Layers Failure',
  props<{ error: string }>()
);

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
export const reverseLayer = createAction(
  '[Layers] Reverse Layer',
  props<{ layerId: string; canvasData: string }>()
);
