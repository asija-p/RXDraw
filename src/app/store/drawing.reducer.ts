import { createReducer, on } from '@ngrx/store';
import { setStrokeColor, setStrokeSize } from './drawing.actions';

export interface StrokeState {
  color: string;
  size: number;
}

export const initialState: StrokeState = {
  color: '#000000',
  size: 5,
};

export const strokeReducer = createReducer(
  initialState,
  on(setStrokeColor, (state, { color }) => ({ ...state, color })),
  on(setStrokeSize, (state, { size }) => ({ ...state, size }))
);
