import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { DrawingEditor } from './pages/drawing-editor/drawing-editor';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'drawing-editor',
    component: DrawingEditor,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  { path: '**', redirectTo: 'home' },
];
