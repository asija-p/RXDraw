import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { App } from './app/app';
import { snapshotReducer, strokeReducer } from './app/store/drawing.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';

bootstrapApplication(App, {
  providers: [
    provideStore({
      stroke: strokeReducer,
      snapshots: snapshotReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
}).catch((err) => console.error(err));
