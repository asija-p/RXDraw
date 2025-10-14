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

  getAll() {
    return this.httpClient.get<Folder[]>(`${environment.api}/folders`);
  }

  add(name: string, icon?: string) {
    return this.httpClient.post<Folder>(`${environment.api}/folders`, { name, icon });
  }

  delete(id: string) {
    return this.httpClient.delete<void>(`${environment.api}/folders/${id}`);
  }

  update(id: string, changes: Partial<Folder>) {
    return this.httpClient.put<Folder>(`${environment.api}/folders/${id}`, changes);
  }
}
