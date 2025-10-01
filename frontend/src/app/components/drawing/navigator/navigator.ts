import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Layer } from '../../../feature/studio/models/layer';
import { CommonModule } from '@angular/common';
import { selectLayers } from '../../../feature/layers/store/layers.selectors';

@Component({
  selector: 'app-navigator',
  imports: [CommonModule],
  templateUrl: './navigator.html',
  styleUrl: './navigator.scss',
})
export class Navigator {
  layers$: Observable<Layer[]>;
  trackById = (_: number, l: Layer) => l.id;

  constructor(private store: Store) {
    this.layers$ = store.select(selectLayers);
  }
}
