import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { App } from './app/app';
import {
  layersReducer,
  historyReducer,
  strokeReducer,
} from './app/feature/studio/store/drawing.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { HistoryEffects } from './app/feature/studio/store/drawing.effects';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { foldersReducer } from './app/feature/folders/store/folders.reducer';
import { FoldersEffects } from './app/feature/folders/store/folders.effects';
import { DrawingsEffects } from './app/feature/drawings/store/drawings.effects';
import { drawingsReducer } from './app/feature/drawings/store/drawings.reducer';

bootstrapApplication(App, {
  providers: [
    provideStore({
      stroke: strokeReducer,
      history: historyReducer,
      layers: layersReducer,
      folders: foldersReducer,
      drawings: drawingsReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideEffects([HistoryEffects, FoldersEffects, DrawingsEffects]),
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
