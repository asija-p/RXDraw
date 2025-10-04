import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

type LoginBody = { name: string; password: string };
type LoginResp = { user: { id: string; name: string }; access_token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: LoginBody) {
    return this.http.post<{ user: any; access_token: string }>(
      `${environment.api}/auth/login`,
      body
    );
  }

  register(body: { name: string; password: string }) {
    return this.http.post(`${environment.api}/users`, body);
  }
}
