import { createReducer, on } from '@ngrx/store';
import {
  addLayer,
  commitHistoryStep,
  redoHistoryStep,
  removeLayer,
  reorderLayers,
  reverseLayer,
  saveLayer,
  setActiveLayer,
  setLayerOpacity,
  setLayerVisibility,
  setStrokeColor,
  setStrokeSize,
  setStrokeTool,
  undoHistoryStep,
} from './drawing.actions';
import { ToolId } from '../models/tool';
import { Layer } from '../models/layer';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { HistoryStep } from '../models/history-step';

const WHITE_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMBApYbW4sAAAAASUVORK5CYII=';

export interface StrokeState {
  color: { r: number; g: number; b: number; a: number };
  size: number;
  tool: ToolId;
}

export const initialState: StrokeState = {
  color: { r: 255, g: 255, b: 0, a: 1 },
  size: 5,
  tool: 'brush',
};

export const strokeReducer = createReducer(
  initialState,
  on(setStrokeColor, (state, { color }) => ({ ...state, color })),
  on(setStrokeSize, (state, { size }) => ({ ...state, size })),
  on(setStrokeTool, (state, { tool }) => ({ ...state, tool }))
);

export interface HistoryState {
  steps: HistoryStep[];
  cursor: number;
}

export const initialHistoryState: HistoryState = {
  steps: [],
  cursor: -1,
};

const MAX_HISTORY = 20;

export const historyReducer = createReducer(
  initialHistoryState,
  on(commitHistoryStep, (state, { step }) => {
    let steps = state.steps.slice(0, state.cursor + 1).concat(step);
    let cursor = steps.length - 1;
    if (steps.length > MAX_HISTORY) {
      const overflow = steps.length - MAX_HISTORY;
      steps = steps.slice(overflow);
      cursor = cursor - overflow;
    }
    return { ...state, steps, cursor };
  }),
  on(undoHistoryStep, (s) => (s.cursor >= 0 ? { ...s, cursor: s.cursor - 1 } : s)),
  on(redoHistoryStep, (s) => (s.cursor < s.steps.length - 1 ? { ...s, cursor: s.cursor + 1 } : s))
);

export interface LayersState extends EntityState<Layer> {
  selectedLayerId: string | null;
}

export const adapter = createEntityAdapter<Layer>({
  sortComparer: (a, b) => b.zIndex - a.zIndex,
});

//change

const backgroundLayer: Layer = {
  id: '0',
  name: 'Background',
  visible: true,
  opacity: 1,
  zIndex: 0,
  canvasData: WHITE_PIXEL,
};

const base = adapter.getInitialState<LayersState>({
  selectedLayerId: '0',
});

export const initialLayersState: LayersState = adapter.addOne(backgroundLayer, base);

//change

export const layersReducer = createReducer(
  initialLayersState,
  on(addLayer, (state, { layer }) => adapter.addOne(layer, state)),
  on(setActiveLayer, (state, { selectedLayerId }) => {
    return {
      ...state,
      selectedLayerId,
    };
  }),
  on(removeLayer, (state, { layerId }) => {
    const next = adapter.removeOne(layerId, state);

    const ids = next.ids as string[];
    const { entities } = next;

    let best: string | null = null;

    for (const id of ids) {
      const currentZ = entities[id]?.zIndex ?? 0;
      const bestZ = best ? entities[best]?.zIndex ?? 0 : -Infinity;

      if (best === null || currentZ > bestZ) {
        best = id;
      }
    }

    const fallbackId = best;

    return { ...next, selectedLayerId: fallbackId };
  }),
  on(setLayerVisibility, (state, { layerId, visible }) =>
    adapter.updateOne({ id: layerId, changes: { visible } }, state)
  ),
  on(setLayerOpacity, (state, { layerId, opacity }) =>
    adapter.updateOne(
      { id: layerId, changes: { opacity: Math.max(0, Math.min(1, opacity)) } },
      state
    )
  ),
  on(reorderLayers, (state, { orderedIds }) => {
    const n = orderedIds.length;
    const updates = orderedIds.map((id, idx) => ({
      id,
      changes: { zIndex: n - 1 - idx },
    }));
    return adapter.updateMany(updates, state);
  }),
  on(saveLayer, (state, { layerId, canvasData }) =>
    adapter.updateOne({ id: layerId, changes: { canvasData: canvasData } }, state)
  ),
  on(reverseLayer, (state, { layerId, canvasData }) =>
    adapter.updateOne({ id: layerId, changes: { canvasData } }, state)
  )
);
