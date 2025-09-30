import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, from, Observable, of } from 'rxjs';
import { DrawingsService } from '../services/drawings-service';
import * as DrawingsActions from './drawings.actions';
import { Action, Store } from '@ngrx/store';
import { saveDrawingFailure, saveDrawingRequested, saveDrawingSuccess } from './drawings.actions';
import { selectDrawingHeight, selectDrawingWidth } from './drawings.selectors';
import { selectLayers } from '../../studio/store/drawing.selectors';
import { composeThumbSimple } from '../../../shared/utils/thumbnail.util';
import { CreateDrawingDto } from '../models/create-drawing.dto';
import { LayersService } from '../../layers/services/layers-service';
import { CreateLayerDto } from '../../layers/models/create-layer.dto';

@Injectable()
export class DrawingsEffects {
  constructor(private drawingsService: DrawingsService, private layersService: LayersService) {}

  private actions$ = inject(Actions);
  private store = inject(Store);

  loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DrawingsActions.loadDrawings),
      switchMap(({ userId, folderId }) =>
        this.drawingsService.getAll(userId, folderId).pipe(
          map((drawings) => DrawingsActions.loadDrawingsSuccess({ drawings: drawings })),
          catchError(() => of({ type: 'load error' }))
        )
      )
    )
  );

  save$ = createEffect(
    (): Observable<Action> =>
      this.actions$.pipe(
        ofType(saveDrawingRequested),
        withLatestFrom(
          this.store.select(selectDrawingWidth),
          this.store.select(selectDrawingHeight),
          this.store.select(selectLayers)
        ),
        switchMap(([{ name, folderId }, width, height, layers]) => {
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          const userId: string | undefined =
            user?.id ?? localStorage.getItem('userId') ?? undefined;

          if (!userId || (width ?? 0) <= 0 || (height ?? 0) <= 0) {
            return of(saveDrawingFailure({ error: 'Missing userId/width/height' }));
          }

          const layersForThumb = (layers ?? []).map((l: any) => ({
            canvasData: l.canvasData as string,
            visible: !!l.visible,
            opacity: l.opacity,
            zIndex: l.zIndex,
          }));

          const thumb$ = layersForThumb.length
            ? from(composeThumbSimple(layersForThumb, width, height, 256))
            : of<string | undefined>(undefined);

          return thumb$.pipe(
            switchMap((thumbnailUrl) => {
              const dto: CreateDrawingDto = {
                name,
                width,
                height,
                userId,
                colors: [],
                folderId: folderId ?? undefined,
                thumbnailUrl: thumbnailUrl ?? undefined,
              };

              return this.drawingsService.create(dto).pipe(
                switchMap((drawing) => {
                  const layerDtos: CreateLayerDto[] = (layers ?? []).map((l: any) => ({
                    name: l.name ?? 'Layer',
                    zIndex: l.zIndex,
                    visible: l.visible,
                    opacity: l.opacity,
                    bitmapUrl: l.canvasData,
                    drawingId: drawing.id,
                  }));

                  if (!layerDtos.length) {
                    return of(saveDrawingSuccess({ drawing }));
                  }

                  return forkJoin(layerDtos.map((d) => this.layersService.create(d))).pipe(
                    map(() => saveDrawingSuccess({ drawing })),
                    catchError((error) => of(saveDrawingFailure({ error })))
                  );
                }),
                catchError((error) => of(saveDrawingFailure({ error })))
              );
            })
          );
        })
      )
  );
}
