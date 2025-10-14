import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../models/folder';
import { environment } from '../../../../environments/environments';
import { filter, firstValueFrom, take } from 'rxjs';
import { selectUserId } from '../../../core/auth/store/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  constructor(private httpClient: HttpClient, private store: Store) {}

  getAll(userId?: string) {
    const params = userId ? new HttpParams().set('userId', userId) : undefined;
    return this.httpClient.get<Folder[]>(environment.api + '/folders', { params });
  }

  add(userId: string, name: string, icon?: string) {
    return this.httpClient.post<Folder>(`${environment.api}/folders`, { name, userId, icon });
  }

  delete(id: string) {
    return this.httpClient.delete<void>(`${environment.api}/folders/${id}`);
  }

  update(id: string, changes: Partial<Folder>) {
    return this.httpClient.put<Folder>(`${environment.api}/folders/${id}`, changes);
  }
}
