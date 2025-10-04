import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { DrawingEditor } from './pages/drawing-editor/drawing-editor';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Landing } from './pages/landing/landing';
import { FolderContents } from './pages/folder-contents/folder-contents';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'drawing-editor',
    component: DrawingEditor,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
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
  {
    path: 'drawing-editor/:id',
    component: DrawingEditor,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
