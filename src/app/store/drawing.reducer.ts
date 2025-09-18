import { createReducer, on } from '@ngrx/store';
import { setStrokeColor } from './drawing.actions';

export interface StrokeState {
  color: string;
}

export const initialState: StrokeState = {
  color: '#000000',
};

export const strokeReducer = createReducer(
  initialState,
  on(setStrokeColor, (state, { color }) => ({ ...state, color }))
);
