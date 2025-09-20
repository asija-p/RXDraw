import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectActiveLayer, selectAllLayers } from '../../store/drawing.selectors';
import { addLayer, setActiveLayer } from '../../store/drawing.actions';
import { Layer } from '../../models/layer';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layers-navigator',
  imports: [CommonModule],
  templateUrl: './layers-navigator.html',
  styleUrl: './layers-navigator.scss',
})
export class LayersNavigator {
  layers$: Observable<Layer[]>;
  trackById = (_: number, l: Layer) => l.id;
  activeId$: Observable<string | null>;

  constructor(private store: Store) {
    this.layers$ = this.store.select(selectAllLayers);
    this.activeId$ = this.store.select(selectActiveLayer);
  }

  addNewLayer() {
    const color = this.randomColor();
    const newLayer: Layer = {
      id: uuid(),
      name: `Layer ${Date.now()}`,
      visible: true,
      opacity: 1,
      zIndex: Date.now(), // or layers.length
      canvasData: this.blankCanvas(color),
    };

    this.store.dispatch(addLayer({ layer: newLayer }));
  }

  randomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 20); // 60–80%
    const l = 75 + Math.floor(Math.random() * 10); // 75–85%
    return `hsl(${h} ${s}% ${l}%)`;
  }

  private blankCanvas(color: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  select(id: string) {
    this.store.dispatch(setActiveLayer({ selectedLayerId: id }));
  }
}
