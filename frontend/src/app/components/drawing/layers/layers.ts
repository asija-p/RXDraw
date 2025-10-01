import { Component, Input } from '@angular/core';
import { combineLatest, filter, map, Observable, Subscription, take, takeLast } from 'rxjs';
import { Layer } from '../../../feature/studio/models/layer';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Canvas } from '../canvas/canvas';
import { ofType } from '@ngrx/effects';
import {
  selectDrawingHeight,
  selectDrawingWidth,
} from '../../../feature/drawings/store/drawings.selectors';
import { selectActiveLayerId, selectLayers } from '../../../feature/layers/store/layers.selectors';

@Component({
  selector: 'app-layers',
  imports: [CommonModule, Canvas],
  templateUrl: './layers.html',
  styleUrl: './layers.scss',
})
export class Layers {
  layers$;
  selectedId$;
  width$;
  height$;
  vm$;
  trackById = (_: number, l: { id: string }) => l.id;
  constructor(private store: Store) {
    this.layers$ = this.store.select(selectLayers);
    this.selectedId$ = this.store.select(selectActiveLayerId);
    this.width$ = this.store.select(selectDrawingWidth);
    this.height$ = this.store.select(selectDrawingHeight);
    this.vm$ = combineLatest({
      layers: this.layers$,
      selectedId: this.selectedId$,
      w: this.width$,
      h: this.height$,
    }).pipe(
      filter(({ w, h }) => w != null && h != null),
      map(({ layers, selectedId, w, h }) => ({
        layers,
        selectedId,
        w: w as number,
        h: h as number,
      }))
    );
  }
}
