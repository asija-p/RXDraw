import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Drawing } from '../../../shared/models/drawing';
import {
  clearDrawings,
  deleteDrawingSuccess,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  openDrawingFailure,
  openDrawingSuccess,
  saveDrawingProgress,
  saveDrawingSuccess,
  setDrawingDimensions,
  setDrawingName,
  updateDrawingSuccess,
} from './drawings.actions';

export interface DrawingsState extends EntityState<Drawing> {
  openedDrawingId: string | null;
  loading: boolean;
  error: string | null;
  progress: string | null;
}

const adapter = createEntityAdapter<Drawing>();

export const initialState: DrawingsState = adapter.getInitialState({
  openedDrawingId: null,
  loading: false,
  error: null,
  progress: null,
});

export const drawingsReducer = createReducer(
  initialState,
  on(loadDrawings, (s) => ({ ...s, loading: true, error: null })),
  on(clearDrawings, (s) => adapter.setAll([], { ...s, loading: true })),
  on(loadDrawingsSuccess, (s, { drawings }) => {
    const next = adapter.setAll(drawings, s);
    return { ...next, loading: false };
  }),
  on(loadDrawingsFailure, (s, { error }) => ({ ...s, loading: false, error })),
  on(openDrawingSuccess, (state, { openedDrawingId }) => {
    return {
      ...state,
      openedDrawingId,
    };
  }),
  on(openDrawingFailure, (state) => ({ ...state, openedDrawingId: null })),
  on(saveDrawingProgress, (s, { message }) => ({ ...s, progress: message })),
  on(saveDrawingSuccess, (state, { drawing }) => {
    const next = adapter.upsertOne(drawing, state);
    return { ...next, openedDrawingId: String(drawing.id), progress: null };
  }),
  on(updateDrawingSuccess, (s, { drawing }) =>
    adapter.updateOne({ id: drawing.id, changes: drawing }, s)
  ),
  on(deleteDrawingSuccess, (s, { id }) => adapter.removeOne(id, s))
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
  on(setDrawingDimensions, (state, { height, width }) => ({ ...state, height, width })),
  on(setDrawingName, (s, { name }) => ({ ...s, name }))
);
