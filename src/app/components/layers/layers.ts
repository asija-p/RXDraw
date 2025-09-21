import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Layer } from '../../models/layer';
import { Store } from '@ngrx/store';
import { selectActiveLayer, selectAllLayers } from '../../store/drawing.selectors';
import { CommonModule } from '@angular/common';
import { Canvas } from '../canvas/canvas';

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
    this.layers$ = this.store.select(selectAllLayers);
    this.selectedLayerId$ = this.store.select(selectActiveLayer);
  }
}
