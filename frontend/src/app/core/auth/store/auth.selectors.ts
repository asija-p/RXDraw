import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectUser = createSelector(selectAuthState, (s) => s.user);
export const selectAccessToken = createSelector(selectAuthState, (s) => s.accessToken);
export const selectIsAuthenticated = createSelector(selectAccessToken, (token) => !!token);
