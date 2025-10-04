import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../store/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthed): boolean | UrlTree => {
      if (isAuthed) return true;

      const raw = localStorage.getItem('auth');
      if (raw) {
        try {
          const { accessToken } = JSON.parse(raw);
          if (accessToken) return true;
        } catch {}
      }

      return router.createUrlTree(['/login']);
    })
  );
};
