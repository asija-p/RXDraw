import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { clearAuthError, loginRequested } from '../../core/auth/store/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../core/auth/store/auth.selectors';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    MatCardModule,
    FormsModule,
    MatSlideToggleModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  error$: Observable<string | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.error$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);
  }

  name = '';
  password = '';
  showPassword = false;

  submit() {
    this.store.dispatch(loginRequested({ name: this.name, password: this.password }));
  }

  ngOnInit() {
    this.store.dispatch(clearAuthError());
  }
}
