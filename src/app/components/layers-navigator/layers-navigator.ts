import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  auditTime,
  combineLatest,
  map,
  Observable,
  Subject,
  Subscription,
  take,
  tap,
  zip,
} from 'rxjs';
import {
  selectActiveLayer,
  selectActiveLayerId,
  selectLayers,
} from '../../store/drawing.selectors';
import {
  addLayer,
  setActiveLayer,
  removeLayer,
  setLayerVisibility,
  setLayerOpacity,
  reorderLayers,
} from '../../store/drawing.actions';
import { Layer } from '../../models/layer';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-layers-navigator',
  imports: [FontAwesomeModule, DragDropModule, CommonModule],
  templateUrl: './layers-navigator.html',
  styleUrl: './layers-navigator.scss',
})
export class LayersNavigator {
  faTrash = faTrash;

  layers$: Observable<Layer[]>;
  activeLayer$: Observable<Layer | undefined>;

  layers: Layer[] = [];
  sub?: Subscription;

  zIndex = 1;
  trackById = (_: number, l: Layer) => l.id;

  constructor(private store: Store) {
    this.layers$ = this.store.select(selectLayers);
    this.activeLayer$ = this.store.select(selectActiveLayer);
  }

  ngOnInit() {
    this.sub = this.layers$.subscribe((ls) => {
      this.layers = [...ls];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onDrop(event: CdkDragDrop<Layer[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.store.dispatch(reorderLayers({ orderedIds: this.layers.map((l) => l.id) }));
  }

  addNewLayer() {
    const newLayer: Layer = {
      id: String(this.zIndex), // or uuid()
      name: `Layer ${this.zIndex}`,
      visible: true,
      opacity: 1,
      zIndex: this.zIndex,
      canvasData: this.blankCanvas(),
    };
    this.zIndex++;
    this.store.dispatch(addLayer({ layer: newLayer }));
    this.store.dispatch(setActiveLayer({ selectedLayerId: newLayer.id }));
  }

  removeSelected() {
    this.activeLayer$.pipe(take(1)).subscribe((layer) => {
      if (layer) this.store.dispatch(removeLayer({ layerId: layer.id }));
    });
  }

  selectLayer(id: string) {
    this.store.dispatch(setActiveLayer({ selectedLayerId: id }));
  }

  private randomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 20);
    const l = 75 + Math.floor(Math.random() * 10);
    return `hsl(${h} ${s}% ${l}%)`;
  }

  private blankCanvas(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    const ctx = canvas.getContext('2d')!;
    return canvas.toDataURL('image/png');
  }

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  onToggleVisible(id: string, currentlyVisible: boolean) {
    this.store.dispatch(setLayerVisibility({ layerId: id, visible: !currentlyVisible }));
  }

  changeOpacity(id: string, ev: Event) {
    const value = Number((ev.target as HTMLInputElement).value); // 0..100
    const opacity = Math.max(0, Math.min(1, value / 100)); // clamp to 0..1
    this.store.dispatch(setLayerOpacity({ layerId: id, opacity }));
  }
}
