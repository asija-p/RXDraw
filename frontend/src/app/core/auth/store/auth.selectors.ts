import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(selectAuthState, (s) => s.loading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);

export const selectAuthUser = createSelector(selectAuthState, (s) => s.user);
export const selectAccessToken = createSelector(selectAuthState, (s) => s.accessToken);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (s) => !!s.accessToken && !!s.user
);
