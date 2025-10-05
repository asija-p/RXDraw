import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { Layer } from '../../../feature/studio/models/layer';
import { CommonModule } from '@angular/common';
import { selectLayers } from '../../../feature/layers/store/layers.selectors';
import {
  selectDrawingHeight,
  selectDrawingWidth,
} from '../../../feature/drawings/store/drawings.selectors';

type VM = {
  layers: Layer[];
  w: number;
  h: number;
  previewW: number;
  previewH: number;
};

@Component({
  selector: 'app-navigator',
  imports: [CommonModule],
  templateUrl: './navigator.html',
  styleUrl: './navigator.scss',
})
export class Navigator {
  layers$: Observable<Layer[]>;
  w$: Observable<number>;
  h$: Observable<number>;

  trackById = (_: number, l: Layer) => l.id;
  constructor(private store: Store) {
    this.layers$ = this.store.select(selectLayers);
    this.w$ = this.store.select(selectDrawingWidth);
    this.h$ = this.store.select(selectDrawingHeight);
  }
}
