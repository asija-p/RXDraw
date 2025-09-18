import { createReducer, on } from '@ngrx/store';
import { setStrokeColor, setStrokeSize, setTool } from './drawing.actions';

export interface StrokeState {
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
}

export const initialState: StrokeState = {
  color: '#000000',
  size: 5,
  tool: 'brush',
};

export const strokeReducer = createReducer(
  initialState,
  on(setStrokeColor, (state, { color }) => ({ ...state, color })),
  on(setStrokeSize, (state, { size }) => ({ ...state, size })),
  on(setTool, (state, { tool }) => ({ ...state, tool }))
);
