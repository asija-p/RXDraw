import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentSnapshot } from '../../store/drawing.selectors';

@Component({
  selector: 'app-navigator',
  imports: [],
  templateUrl: './navigator.html',
  styleUrl: './navigator.scss',
})
export class Navigator implements AfterViewInit {
  @ViewChild('previewCanvas', { static: true })
  previewCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private store: Store) {}

  ngAfterViewInit() {
    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    this.store.select(selectCurrentSnapshot).subscribe((snapshot) => {
      if (snapshot) {
        const img = new Image();
        img.src = snapshot;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    });
  }
}
