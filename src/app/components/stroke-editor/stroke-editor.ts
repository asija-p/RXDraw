import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorChromeModule } from 'ngx-color/chrome';
import { setStrokeColor } from '../../store/drawing.actions';

@Component({
  selector: 'app-stroke-editor',
  imports: [ColorChromeModule],
  templateUrl: './stroke-editor.html',
  styleUrl: './stroke-editor.scss',
})
export class StrokeEditor {
  strokeColor = '#000000';

  constructor(private store: Store) {}

  onColorChange(event: any) {
    const color = event.color.hex;
    this.strokeColor = color;
    this.store.dispatch(setStrokeColor({ color }));
  }
}
