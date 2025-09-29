import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Folder } from '../../feature/folders/models/folder';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { createFolder, loadFolders } from '../../feature/folders/store/folders.actions';
import { Store } from '@ngrx/store';
import { selectFoldersList } from '../../feature/folders/store/folders.selectors';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DesignFolder } from '../../components/folders/design-folder/design-folder';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatCardModule, MatIconModule, MatDialogModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  folders$: Observable<Folder[]> = of([]);
  readonly dialog = inject(MatDialog);

  constructor(private store: Store) {
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
}
