import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { createFolder } from '../../../feature/folders/store/folders.actions';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-design-folder',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './design-folder.html',
  styleUrl: './design-folder.scss',
})
export class DesignFolder {
  constructor(private store: Store) {}

  private dialogRef = inject(MatDialogRef<DesignFolder>);
  name = '';
  icon = 'folder'; // default
  icons = [
    'folder',
    'palette',
    'brush',
    'image',
    'collections',
    'photo',
    'star',
    'favorite',
    'folder_open',
  ];

  submit() {
    const name = this.name.trim();
    if (!name) return;
    this.store.dispatch(createFolder({ name, icon: this.icon }));
    this.dialogRef.close({ created: true });
  }

  cancel() {
    this.dialogRef.close();
  }
}
