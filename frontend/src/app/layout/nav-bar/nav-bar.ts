import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectUser } from '../../core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../core/auth/models/user';
import { logout } from '../../core/auth/store/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, MatButtonModule, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  isAuthed$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(private store: Store) {
    this.isAuthed$ = this.store.select(selectIsAuthenticated);
    this.user$ = this.store.select(selectUser);
  }

  logOut() {
    this.store.dispatch(logout());
  }
}
