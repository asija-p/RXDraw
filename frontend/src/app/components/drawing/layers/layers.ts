import { Component, Input } from '@angular/core';
import { filter, map, Observable, Subscription, take, takeLast } from 'rxjs';
import { Layer } from '../../../feature/studio/models/layer';
import { Store } from '@ngrx/store';
import { selectActiveLayerId, selectLayers } from '../../../feature/studio/store/drawing.selectors';
import { CommonModule } from '@angular/common';
import { Canvas } from '../canvas/canvas';
import { reverseLayer } from '../../../feature/studio/store/drawing.actions';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'app-layers',
  imports: [CommonModule, Canvas],
  templateUrl: './layers.html',
  styleUrl: './layers.scss',
})
export class Layers {
  @Input() public width = 700;
  @Input() public height = 700;

  trackById = (_: number, l: any) => l.id;
  public layers$;
  public selectedLayerId$;

  constructor(private store: Store) {
    this.layers$ = this.store.select(selectLayers);
    this.selectedLayerId$ = this.store.select(selectActiveLayerId);
  }
}
