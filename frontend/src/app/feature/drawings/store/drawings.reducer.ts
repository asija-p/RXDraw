import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Drawing } from '../../../shared/models/drawing';
import { loadDrawingsSuccess, setDrawingDimensions } from './drawings.actions';

export interface DrawingsState extends EntityState<Drawing> {}

const adapter = createEntityAdapter<Drawing>();

export const initialState: DrawingsState = adapter.getInitialState({});

export const drawingsReducer = createReducer(
  initialState,
  on(loadDrawingsSuccess, (state, { drawings }) => adapter.setAll(drawings, state))
);

export interface DrawingState {
  height: number;
  width: number;
  name: string | null;
}

export const initialDrawingState: DrawingState = {
  height: 0,
  width: 0,
  name: null,
};

export const drawingReducer = createReducer(
  initialDrawingState,
  on(setDrawingDimensions, (state, { height, width }) => ({ ...state, height, width }))
);
