import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setCanvasDimensions } from '../../../feature/studio/store/drawing.actions';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-settings-drawing',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './settings-drawing.html',
  styleUrl: './settings-drawing.scss',
})
export class SettingsDrawing {
  constructor(private store: Store) {}

  width: number = 0;
  height: number = 0;

  submit() {
    this.store.dispatch(setCanvasDimensions({ height: this.height, width: this.width }));
  }

  cancel() {}
}
