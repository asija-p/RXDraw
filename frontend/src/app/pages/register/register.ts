import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { AuthApi } from '../../api/auth.api';
import { Router } from '@angular/router';

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
  private auth = inject(AuthApi);
  private router = inject(Router);

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

    this.auth.register({ name: this.name, password: this.password }).subscribe({
      next: () => {
        this.auth.login({ name: this.name, password: this.password }).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.access_token);
            this.router.navigateByUrl('/home');
          },
          error: () => {
            this.router.navigateByUrl('/login');
          },
        });
      },
      error: (err) => {
        alert('Could not register. The username may be taken.');
      },
    });
  }
}
