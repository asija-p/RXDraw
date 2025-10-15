import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { registerRequested } from '../../core/auth/store/auth.actions';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../core/auth/store/auth.selectors';

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
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  error$: Observable<string | null>;
  loading$: Observable<boolean>;
  formError: string | null = null;

  constructor(private store: Store) {
    this.error$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);
  }

  name = '';
  password = '';
  confirm = '';
  showPassword = false;
  showConfirmPassword = false;

  submit() {
    this.formError = null;

    if (!this.name || !this.password) {
      this.formError = 'Please fill all fields.';
      return;
    }
    if (this.password !== this.confirm) {
      this.formError = 'Passwords do not match.';
      return;
    }

    this.store.dispatch(registerRequested({ name: this.name, password: this.password }));
  }
}
