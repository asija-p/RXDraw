import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { using } from 'rxjs';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectUser = createSelector(selectAuthState, (s) => s.user);
export const selectUserId = createSelector(selectAuthState, (s) => s.user?.id);
export const selectAccessToken = createSelector(selectAuthState, (s) => s.accessToken);
export const selectIsAuthenticated = createSelector(selectAccessToken, (token) => !!token);
