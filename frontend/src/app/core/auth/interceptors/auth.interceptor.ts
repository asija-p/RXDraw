import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { first, switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { selectAccessToken } from '../store/auth.selectors';
import { logout } from '../store/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAccessToken).pipe(
    first(),
    switchMap((token) => {
      const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

      return next(authReq).pipe(
        catchError((err) => {
          if (err.status === 401) {
            store.dispatch(logout());
            router.navigateByUrl('/');
          }
          return throwError(() => err);
        })
      );
    })
  );
};
