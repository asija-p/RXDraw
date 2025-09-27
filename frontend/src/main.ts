import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { App } from './app/app';
import { layersReducer, historyReducer, strokeReducer } from './app/store/drawing.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { HistoryEffects } from './app/store/drawing.effects';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideStore({
      stroke: strokeReducer,
      history: historyReducer,
      layers: layersReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideEffects([HistoryEffects]),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
