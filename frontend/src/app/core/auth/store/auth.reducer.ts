import { createReducer, on } from '@ngrx/store';
import {
  loginFailure,
  loginRequested,
  loginSuccess,
  logout,
  registerFailure,
  registerRequested,
  registerSuccess,
} from './auth.actions';
import { User } from '../models/user';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(loginRequested, (s) => ({ ...s, loading: true, error: null })),
  on(loginSuccess, (s, { user, accessToken }) => ({
    ...s,
    user,
    accessToken,
    loading: false,
    error: null,
  })),
  on(loginFailure, (s, { error }) => ({ ...s, loading: false, error })),

  // Register
  on(registerRequested, (s) => ({ ...s, loading: true, error: null })),
  on(registerSuccess, (s) => s),
  on(registerFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(logout, () => ({ ...initialAuthState }))
);
