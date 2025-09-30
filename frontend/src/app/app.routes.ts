import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { DrawingEditor } from './pages/drawing-editor/drawing-editor';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Landing } from './pages/landing/landing';
import { FolderContents } from './pages/folder-contents/folder-contents';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'drawing-editor',
    component: DrawingEditor,
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: ':id',
    component: FolderContents,
  },
  { path: '**', redirectTo: '' },
];
