import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { App } from './app/app';
import { strokeReducer } from './app/store/drawing.reducer';

bootstrapApplication(App, {
  providers: [provideStore({ stroke: strokeReducer })],
}).catch((err) => console.error(err));
