import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Folder } from '../../models/folder';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private http = inject(HttpClient);
  private router = inject(Router);

  folders: Folder[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      this.router.navigateByUrl('/login');
      return;
    }

    const { id } = JSON.parse(userStr) as { id: string; name: string };

    this.http
      .get<Folder[]>('http://localhost:3000/folders', {
        params: { userId: id },
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (list) => {
          this.folders = list;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) this.router.navigateByUrl('/login');
          else this.error = 'Could not load folders.';
        },
      });
  }
}
