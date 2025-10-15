import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../store/auth.actions';
import { catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);

  const isAuthEndpoint = req.url.endsWith('/auth/login') || req.url.endsWith('/auth/register');

  // attach token for non-auth requests
  const token = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth')!).accessToken
    : null;

  const authReq =
    !isAuthEndpoint && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    // only global-handle 401s for non-auth endpoints
    // (login/register should just surface the error to the component/effect)
    // RxJS import: catchError
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !isAuthEndpoint) {
        store.dispatch(logout());
        router.navigateByUrl('/');
      }
      throw err;
    })
  );
};
