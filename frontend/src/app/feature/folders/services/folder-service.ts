import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../models/folder';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  constructor(private httpClient: HttpClient) {}

  getAll(userId?: string) {
    const params = userId ? new HttpParams().set('userId', userId) : undefined;
    return this.httpClient.get<Folder[]>(environment.api + 'folders', { params });
  }

  add(name: string, icon?: string) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.id as string;
    return this.httpClient.post<Folder>(environment.api + 'folders', { name, userId, icon });
  }

  delete(id: string) {
    return this.httpClient.delete<void>(`${environment.api}folders/${id}`);
  }
}
