import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs';

import { setDrawingDimensions } from '../../../feature/drawings/store/drawings.actions';
import { selectLayers } from '../../../feature/layers/store/layers.selectors';
import { addLayer, setActiveLayer } from '../../../feature/layers/store/layers.actions';
import { Layer } from '../../../feature/studio/models/layer';

@Component({
  selector: 'app-settings-drawing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './settings-drawing.html',
  styleUrl: './settings-drawing.scss',
})
export class SettingsDrawing {
  constructor(private store: Store, private dialogRef: MatDialogRef<SettingsDrawing>) {}

  width = 0;
  height = 0;

  submit() {
    this.store.dispatch(setDrawingDimensions({ height: this.height, width: this.width }));

    this.store
      .select(selectLayers)
      .pipe(take(1))
      .subscribe((layers) => {
        if ((layers?.length ?? 0) === 0 && this.width > 0 && this.height > 0) {
          const id = '0';
          const layer: Layer = {
            id,
            name: 'Layer 0',
            visible: true,
            opacity: 1,
            zIndex: 0,
            canvasData: this.whiteDataUrl(this.width, this.height),
          };
          this.store.dispatch(addLayer({ layer }));
          this.store.dispatch(setActiveLayer({ selectedLayerId: id }));
        }
        this.dialogRef.close();
      });
  }

  private whiteDataUrl(w: number, h: number): string {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.floor(w));
    c.height = Math.max(1, Math.floor(h));
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }
}
