import { createAction, props } from '@ngrx/store';

export const setStrokeColor = createAction('[Stroke] Set Color', props<{ color: string }>());
