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

  getAll(folderId?: string) {
    const options = folderId ? { params: { folderId } } : {};
    return this.httpClient.get<Drawing[]>(`${environment.api}/drawings`, options);
  }

  create(dto: CreateDrawingDto) {
    return this.httpClient.post<Drawing>(`${environment.api}/drawings`, dto);
  }

  getById(id: string) {
    return this.httpClient.get<Drawing>(`${environment.api}/drawings/${id}`);
  }

  update(id: string, changes: Partial<Drawing> & { folderId?: string | null }) {
    return this.httpClient.put<Drawing>(`${environment.api}/drawings/${id}`, changes);
  }

  save(id: string, dto: SaveDto) {
    return this.httpClient.put<Drawing>(`${environment.api}/drawings/${id}/save`, dto);
  }

  delete(id: string) {
    return this.httpClient.delete(`${environment.api}/drawings/${id}`);
  }
}
