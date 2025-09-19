import { createReducer, on } from '@ngrx/store';
import { setStrokeColor, setStrokeSize, setStrokeTool } from './drawing.actions';
import { ToolId } from '../models/tool';

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
