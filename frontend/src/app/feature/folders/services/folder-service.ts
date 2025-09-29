import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../models/folder';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get<Folder[]>(environment.api + 'folders');
  }

  add(name: string, icon?: string) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.id as string;
    return this.httpClient.post<Folder>(environment.api + 'folders', { name, userId, icon });
  }
}
