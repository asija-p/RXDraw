import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, first, map, switchMap } from 'rxjs';
import { selectAccessToken } from '../auth/store/auth.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private store = inject(Store);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectAccessToken).pipe(
      first(),
      map((token) =>
        token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req
      ),
      switchMap((authedReq) => next.handle(authedReq))
    );
  }
}
