import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAllLayers } from '../../store/drawing.selectors';
import { addLayer } from '../../store/drawing.actions';
import { Layer } from '../../models/layer';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layers',
  imports: [CommonModule],
  templateUrl: './layers.html',
  styleUrl: './layers.scss',
})
export class Layers {
  layers$: Observable<Layer[]>;

  constructor(private store: Store) {
    this.layers$ = this.store.select(selectAllLayers);
  }

  addNewLayer() {
    const newLayer: Layer = {
      id: uuid(),
      name: `Layer ${Date.now()}`,
      visible: true,
      opacity: 1,
      zIndex: Date.now(), // or layers.length
      canvasData: this.blankCanvas(), // function to generate empty base64
    };

    this.store.dispatch(addLayer({ layer: newLayer }));
  }

  private blankCanvas(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }
}
