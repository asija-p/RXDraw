import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Drawing } from '../../../shared/models/drawing';
import { loadDrawingsSuccess } from './drawings.actions';

export interface DrawingsState extends EntityState<Drawing> {}

const adapter = createEntityAdapter<Drawing>();

export const initialState: DrawingsState = adapter.getInitialState({});

export const drawingsReducer = createReducer(
  initialState,
  on(loadDrawingsSuccess, (state, { drawings }) => adapter.setAll(drawings, state))
);
