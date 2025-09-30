import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Folder } from '../../feature/folders/models/folder';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  createFolder,
  deleteFolder,
  loadFolders,
  openFolder,
} from '../../feature/folders/store/folders.actions';
import { Store } from '@ngrx/store';
import { selectFoldersList } from '../../feature/folders/store/folders.selectors';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DesignFolder } from '../../components/folders/design-folder/design-folder';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterLink, RouterLinkActive } from '@angular/router'; // ⬅️ add this

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CdkMenuModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  folders$: Observable<Folder[]> = of([]);
  readonly dialog = inject(MatDialog);

  constructor(private store: Store, private router: Router) {
    this.folders$ = this.store.select(selectFoldersList);
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.id ?? '';
    //console.log(userId);
    //console.log('lol');
    this.store.dispatch(loadFolders({ userId }));
  }

  addFolder() {
    this.dialog.open(DesignFolder);
  }

  onDelete(id: string) {
    this.store.dispatch(deleteFolder({ folderId: id }));
  }

  openFolder(id: string) {
    this.store.dispatch(openFolder({ folderId: id }));
    this.router.navigate(['/', id]);
  }
}
