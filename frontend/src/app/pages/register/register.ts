import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { registerRequested } from '../../core/auth/store/auth.actions';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(private store: Store) {}

  name = '';
  password = '';
  confirm = '';

  submit() {
    if (!this.name || !this.password) {
      alert('Please fill all fields.');
      return;
    }
    if (this.password !== this.confirm) {
      alert('Passwords do not match.');
      return;
    }

    this.store.dispatch(registerRequested({ name: this.name, password: this.password }));
  }
}
