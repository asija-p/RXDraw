import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { auditTime, combineLatest, map, Observable, Subject, take, tap, zip } from 'rxjs';
import { selectActiveLayerId, selectLayers } from '../../store/drawing.selectors';
import {
  addLayer,
  setActiveLayer,
  removeLayer,
  setLayerVisibility,
  setLayerOpacity,
} from '../../store/drawing.actions';
import { Layer } from '../../models/layer';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layers-navigator',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './layers-navigator.html',
  styleUrl: './layers-navigator.scss',
})
export class LayersNavigator {
  layers$: Observable<Layer[]>;
  activeId$: Observable<string | null>;
  selectedLayer$: Observable<Layer | null>;
  private opacityLive$ = new Subject<{ id: string; opacity: number }>();

  zIndex = 1;
  trackById = (_: number, l: Layer) => l.id;

  constructor(private store: Store) {
    this.layers$ = this.store.select(selectLayers);
    this.activeId$ = this.store.select(selectActiveLayerId);

    this.selectedLayer$ = combineLatest([this.layers$, this.activeId$]).pipe(
      map(([layers, id]) => layers.find((l) => l.id === id) ?? null)
    );

    // debounced live updates while dragging the slider (smooth UI, fewer actions)
    this.opacityLive$
      .pipe(auditTime(16)) // ~1 frame; tweak if you want
      .subscribe(({ id, opacity }) =>
        this.store.dispatch(setLayerOpacity({ layerId: id, opacity }))
      );
  }

  addNewLayer() {
    const color = this.randomColor();
    const newLayer: Layer = {
      id: String(this.zIndex), // or uuid()
      name: `Layer ${this.zIndex}`,
      visible: true,
      opacity: 1 / 5,
      zIndex: this.zIndex,
      canvasData: this.blankCanvas(color),
    };
    this.zIndex++;
    this.store.dispatch(addLayer({ layer: newLayer }));
    this.store.dispatch(setActiveLayer({ selectedLayerId: newLayer.id }));
  }

  removeSelected() {
    this.activeId$.pipe(take(1)).subscribe((id) => {
      if (id) this.store.dispatch(removeLayer({ layerId: id }));
    });
  }

  select(id: string) {
    this.store.dispatch(setActiveLayer({ selectedLayerId: id }));
  }

  private randomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 20);
    const l = 75 + Math.floor(Math.random() * 10);
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

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  onToggleVisible(id: string, currentlyVisible: boolean) {
    this.store.dispatch(setLayerVisibility({ layerId: id, visible: !currentlyVisible }));
  }

  // opacity handlers
  onOpacityInput(id: string, value: string) {
    this.opacityLive$.next({ id, opacity: +value }); // live preview
  }
  onOpacityChange(id: string, value: string) {
    this.store.dispatch(setLayerOpacity({ layerId: id, opacity: +value })); // final commit
  }
}
