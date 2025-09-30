import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateLayerDto } from '../models/create-layer.dto';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { Layer } from '../../studio/models/layer';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  constructor(private http: HttpClient) {}

  create(dto: CreateLayerDto): Observable<Layer> {
    return this.http.post<Layer>(environment.api + `layers`, dto);
  }
}
