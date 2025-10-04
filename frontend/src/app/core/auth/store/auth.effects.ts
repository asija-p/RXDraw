import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, switchMap, of, from, map, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import {
  loginRequested,
  loginSuccess,
  loginFailure,
  registerRequested,
  registerSuccess,
  registerFailure,
  logout,
} from './auth.actions';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // LOGIN
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequested),
      exhaustMap(({ name, password }) =>
        this.authService.login({ name, password }).pipe(
          map((resp: { user: User; access_token: string }) =>
            loginSuccess({ user: resp.user, accessToken: resp.access_token })
          ),
          catchError((err: HttpErrorResponse | any) =>
            of(loginFailure({ error: err?.error?.message ?? 'Login failed' }))
          )
        )
      )
    )
  );

  // REGISTER
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerRequested),
      exhaustMap(({ name, password }) =>
        this.authService.register({ name, password }).pipe(
          switchMap(() => from([registerSuccess(), loginRequested({ name, password })])),
          catchError((err: HttpErrorResponse | any) =>
            of(registerFailure({ error: err?.error?.message ?? 'Register failed' }))
          )
        )
      )
    )
  );

  loginNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );
}
