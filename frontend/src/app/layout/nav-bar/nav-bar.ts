import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthDialog } from '../../shared/components/auth-dialog/auth-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, MatButtonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  readonly dialog = inject(MatDialog);
  openRegister(): void {
    const ref = this.dialog.open(AuthDialog);
    ref.componentInstance.mode = 'register';
  }

  openLogin(): void {
    const ref = this.dialog.open(AuthDialog);
    ref.componentInstance.mode = 'login';
  }
}
