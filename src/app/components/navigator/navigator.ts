import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentSnapshot, selectLayers } from '../../store/drawing.selectors';
import { Observable } from 'rxjs';
import { Layer } from '../../models/layer';

@Component({
  selector: 'app-navigator',
  imports: [],
  templateUrl: './navigator.html',
  styleUrl: './navigator.scss',
})
export class Navigator implements AfterViewInit {
  @ViewChild('previewCanvas', { static: true })
  previewCanvas!: ElementRef<HTMLCanvasElement>;
  layers$: Observable<Layer[]>;

  constructor(private store: Store) {
    this.layers$ = store.select(selectLayers);
  }

  ngAfterViewInit() {
    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    this.store.select(selectCurrentSnapshot).subscribe((snapshot) => {
      if (snapshot) {
        const img = new Image();
        img.src = snapshot.canvasData;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    });
  }
}
