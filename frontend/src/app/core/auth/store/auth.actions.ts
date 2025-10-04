import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

// Login
export const loginRequested = createAction(
  '[Auth] Login Requested',
  props<{ name: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string }>()
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Register
export const registerRequested = createAction(
  '[Auth] Register Requested',
  props<{ name: string; password: string }>()
);
export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

// Logout
export const logout = createAction('[Auth] Logout');
