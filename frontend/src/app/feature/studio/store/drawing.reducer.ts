import { createReducer, on } from '@ngrx/store';
import {
  cameraReset,
  cameraSet,
  commitHistoryStep,
  redoHistoryStep,
  setStrokeColor,
  setStrokeSize,
  setStrokeTool,
  undoHistoryStep,
} from './drawing.actions';
import { ToolId } from '../models/tool';
import { HistoryStep } from '../models/history-step';

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

export interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
}

export const initialCameraState: CameraState = {
  zoom: 1,
  panX: 0,
  panY: 0,
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const ZMIN = 0.25;
const ZMAX = 8;

export const cameraReducer = createReducer(
  initialCameraState,
  on(cameraSet, (state, { zoom, panX, panY }) => ({
    zoom: zoom !== undefined ? clamp(zoom, ZMIN, ZMAX) : state.zoom,
    panX: panX ?? state.panX,
    panY: panY ?? state.panY,
  })),
  on(cameraReset, () => initialCameraState)
);
