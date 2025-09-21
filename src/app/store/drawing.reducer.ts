import { createReducer, on } from '@ngrx/store';
import {
  addLayer,
  addSnapshot,
  redoSnapshot,
  removeLayer,
  setActiveLayer,
  setLayerOpacity,
  setLayerVisibility,
  setStrokeColor,
  setStrokeSize,
  setStrokeTool,
  undoSnapshot,
} from './drawing.actions';
import { ToolId } from '../models/tool';
import { Layer } from '../models/layer';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface StrokeState {
  color: { r: number; g: number; b: number; a: number };
  size: number;
  tool: ToolId;
}

export const initialState: StrokeState = {
  color: { r: 0, g: 0, b: 0, a: 1 },
  size: 5,
  tool: 'brush',
};

export const strokeReducer = createReducer(
  initialState,
  on(setStrokeColor, (state, { color }) => ({ ...state, color })),
  on(setStrokeSize, (state, { size }) => ({ ...state, size })),
  on(setStrokeTool, (state, { tool }) => ({ ...state, tool }))
);

export interface SnapshotState {
  snapshots: string[];
  index: number;
}

export const initialSnapshotState: SnapshotState = {
  snapshots: [],
  index: -1,
};

export const snapshotReducer = createReducer(
  initialSnapshotState,
  on(addSnapshot, (state, { snapshot }) => {
    const truncated = state.snapshots.slice(0, state.index + 1);
    const newSnapshots = [...truncated, snapshot];

    return {
      snapshots: newSnapshots,
      index: newSnapshots.length - 1,
    };
  }),
  on(undoSnapshot, (state) => ({
    ...state,
    index: Math.max(0, state.index - 1),
  })),
  on(redoSnapshot, (state) => ({
    ...state,
    index: Math.min(state.snapshots.length - 1, state.index + 1),
  }))
);

export interface LayersState extends EntityState<Layer> {
  selectedLayerId: string | null;
}

export const adapter = createEntityAdapter<Layer>();

//change
const WHITE_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMBApYbW4sAAAAASUVORK5CYII=';

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
  )
);
