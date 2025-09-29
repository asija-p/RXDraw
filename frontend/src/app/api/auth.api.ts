import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type LoginBody = { name: string; password: string };
type LoginResp = { user: { id: string; name: string }; access_token: string };

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(body: LoginBody) {
    return this.http.post<{ user: any; access_token: string }>(`${this.BASE}/auth/login`, body);
  }

  register(body: { name: string; password: string }) {
    return this.http.post(`${this.BASE}/users`, body);
  }
}
