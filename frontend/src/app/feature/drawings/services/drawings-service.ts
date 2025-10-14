import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../shared/models/drawing';
import { environment } from '../../../../environments/environments';
import { SaveDto } from '../models/save.dto';
import { CreateDrawingDto } from '../models/create-drawing.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawingsService {
  constructor(private httpClient: HttpClient) {}

  getAll(userId?: string, folderId?: string) {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    if (folderId) params = params.set('folderId', folderId);

    return this.httpClient.get<Drawing[]>(`${environment.api}/drawings`, { params });
  }

  create(dto: CreateDrawingDto) {
    return this.httpClient.post<Drawing>(`${environment.api}/drawings`, dto);
  }

  getById(id: string) {
    return this.httpClient.get<Drawing>(`${environment.api}/drawings/${id}`);
  }

  save(id: string, dto: SaveDto) {
    return this.httpClient.put<Drawing>(`${environment.api}/drawings/${id}/save`, dto);
  }

  update(id: string, changes: Partial<Drawing>) {
    return this.httpClient.put<Drawing>(`${environment.api}/drawings/${id}`, changes);
  }

  delete(id: string) {
    return this.httpClient.delete<void>(`${environment.api}/drawings/${id}`);
  }
}
