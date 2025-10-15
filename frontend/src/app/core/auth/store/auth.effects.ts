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
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { isJwtExpired } from '../utils/jwt.utils';

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
        tap(() => {
          const url = this.router.url;
          if (url === '/' || url.startsWith('/login') || url.startsWith('/register')) {
            this.router.navigate(['/home']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.router.navigateByUrl('/'); // side-effect samo
        })
      ),
    { dispatch: false }
  );

  persistOnLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ user, accessToken }) => {
          localStorage.setItem('auth', JSON.stringify({ user, accessToken }));
        })
      ),
    { dispatch: false }
  );

  initFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const raw = localStorage.getItem('auth');
        if (!raw) return { type: '[Auth] Noop' as const };

        try {
          const { user, accessToken } = JSON.parse(raw) as { user: User; accessToken: string };
          if (!accessToken || isJwtExpired(accessToken)) {
            localStorage.removeItem('auth');
            return { type: '[Auth] Noop' as const };
          }
          return loginSuccess({ user, accessToken });
        } catch {
          localStorage.removeItem('auth');
          return { type: '[Auth] Noop' as const };
        }
      }),
      filter((a): a is ReturnType<typeof loginSuccess> => a.type !== '[Auth] Noop')
    )
  );

  clearOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => localStorage.removeItem('auth'))
      ),
    { dispatch: false }
  );
}
