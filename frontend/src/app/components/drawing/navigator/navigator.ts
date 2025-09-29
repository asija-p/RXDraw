import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLayers } from '../../../store/drawing.selectors';
import { Observable } from 'rxjs';
import { Layer } from '../../../models/layer';
import { CommonModule } from '@angular/common';

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
