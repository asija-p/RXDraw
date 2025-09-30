import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../shared/models/drawing';
import { environment } from '../../../../environments/environments';
import { CreateDrawingDto } from '../models/create-drawing.dto';

@Injectable({
  providedIn: 'root',
})
export class DrawingsService {
  constructor(private httpClient: HttpClient) {}

  getAll(userId?: string, folderId?: string) {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    if (folderId) params = params.set('folderId', folderId);

    return this.httpClient.get<Drawing[]>(`${environment.api}drawings`, { params });
  }

  create(dto: CreateDrawingDto) {
    return this.httpClient.post<Drawing>(`${environment.api}drawings`, dto);
  }
}
