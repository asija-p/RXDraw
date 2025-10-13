import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  delay,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { firstValueFrom, forkJoin, from, Observable, of } from 'rxjs';
import { DrawingsService } from '../services/drawings-service';
import { Action, Store } from '@ngrx/store';
import {
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  openDrawingFailure,
  openDrawingRequested,
  openDrawingSuccess,
  saveCurrentFailure,
  saveCurrentRequested,
  saveCurrentSuccess,
  saveDrawingFailure,
  saveDrawingProgress,
  saveDrawingRequested,
  saveDrawingSuccess,
  setDrawingDimensions,
  setDrawingName,
} from './drawings.actions';
import {
  selectDrawingHeight,
  selectDrawingState,
  selectDrawingWidth,
  selectOpenedDrawingId,
} from './drawings.selectors';
import { composeThumbSimple } from '../../../shared/utils/thumbnail.util';
import { LayersService } from '../../layers/services/layers-service';
import { CreateLayerDto } from '../../layers/models/create-layer.dto';
import { selectLayers } from '../../layers/store/layers.selectors';
import { loadLayers, saveLayersRequested } from '../../layers/store/layers.actions';
import { Drawing } from '../../../shared/models/drawing';
import { selectUserId } from '../../../core/auth/store/auth.selectors';
import { CreateDrawingDto } from '../models/create-drawing.dto';
import { SaveDto } from '../models/save.dto';

@Injectable()
export class DrawingsEffects {
  constructor(private drawingsService: DrawingsService, private layersService: LayersService) {}

  private actions$ = inject(Actions);
  private store = inject(Store);

  loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDrawings),
      switchMap(({ userId, folderId }) =>
        this.drawingsService.getAll(userId, folderId).pipe(
          map((drawings) => loadDrawingsSuccess({ drawings })),
          catchError((err) => of(loadDrawingsFailure({ error: String(err?.message ?? err) })))
        )
      )
    )
  );

  saveAs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveDrawingRequested),
      withLatestFrom(
        this.store.select(selectUserId),
        this.store.select(selectDrawingWidth),
        this.store.select(selectDrawingHeight),
        this.store.select(selectLayers)
      ),
      switchMap(([{ name, folderId }, userId, width, height, layers]) => {
        if (!userId || (width ?? 0) <= 0 || (height ?? 0) <= 0) {
          return of(saveDrawingFailure({ error: 'Missing userId/width/height' }));
        }

        this.store.dispatch(saveDrawingProgress({ message: 'Saving…' }));

        const layersForThumb = (layers ?? []).map((l: any) => ({
          canvasData: l.canvasData as string,
          visible: !!l.visible,
          opacity: l.opacity,
          zIndex: l.zIndex,
        }));

        const thumbPromise = new Promise<string | undefined>(async (resolve, reject) => {
          try {
            const thumb = layersForThumb.length
              ? await composeThumbSimple(layersForThumb, width!, height!, 256)
              : undefined;

            setTimeout(() => {
              this.store.dispatch(saveDrawingProgress({ message: 'Created thumbnail…' }));
              resolve(thumb);
            }, 500);
          } catch (err) {
            reject(err);
          }
        });

        return from(thumbPromise).pipe(
          switchMap((thumbnailUrl) => {
            const dto: CreateDrawingDto = {
              name,
              width: width!,
              height: height!,
              userId: userId as string,
              colors: [],
              folderId: folderId ?? undefined,
              thumbnailUrl: thumbnailUrl ?? undefined,
            };

            return this.drawingsService.create(dto).pipe(
              switchMap((drawing) => {
                this.store.dispatch(saveLayersRequested({ drawingId: String(drawing.id) }));

                return of(drawing).pipe(
                  delay(500),
                  tap(() =>
                    this.store.dispatch(saveDrawingProgress({ message: 'Drawing saved!' }))
                  ),
                  map((done) => saveDrawingSuccess({ drawing: done }))
                );
              }),
              catchError((err) => of(saveDrawingFailure({ error: err?.message ?? 'Save failed' })))
            );
          }),
          catchError((err) => of(saveDrawingFailure({ error: err?.message ?? 'Thumbnail failed' })))
        );
      })
    )
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveCurrentRequested),
      withLatestFrom(
        this.store.select(selectOpenedDrawingId),
        this.store.select(selectDrawingWidth),
        this.store.select(selectDrawingHeight),
        this.store.select(selectLayers),
        this.store.select(selectUserId),
        this.store.select(selectDrawingState)
      ),
      switchMap(([_, openedId, width, height, layers, userId, ds]) => {
        if (!openedId || (width ?? 0) <= 0 || (height ?? 0) <= 0) {
          return of(saveCurrentFailure({ error: 'Missing openedId/width/height' }));
        }

        this.store.dispatch(saveDrawingProgress({ message: 'Saving…' }));

        const layersForThumb = (layers ?? []).map((l: any) => ({
          canvasData: l.canvasData as string,
          visible: !!l.visible,
          opacity: l.opacity,
          zIndex: l.zIndex,
        }));

        const thumbPromise = new Promise<string | undefined>(async (resolve, reject) => {
          try {
            const thumb = layersForThumb.length
              ? await composeThumbSimple(layersForThumb, width!, height!, 256)
              : undefined;

            setTimeout(() => {
              this.store.dispatch(saveDrawingProgress({ message: 'Created thumbnail…' }));
              resolve(thumb);
            }, 300);
          } catch (err) {
            reject(err);
          }
        });

        return from(thumbPromise).pipe(
          switchMap((thumbnailUrl) => {
            const dto: SaveDto = {
              name: ds?.name ?? undefined,
              width: width!,
              height: height!,
              thumbnailUrl: thumbnailUrl ?? undefined,
              layers: (layers ?? []).map((l: any) => ({
                id: l.id,
                name: l.name,
                zIndex: l.zIndex,
                visible: l.visible,
                opacity: l.opacity,
                canvasData: l.canvasData ?? undefined,
              })),
            };

            return this.drawingsService.save(openedId, dto).pipe(
              tap(() => this.store.dispatch(saveDrawingProgress({ message: 'Saved!' }))),
              map((drawing) => saveCurrentSuccess({ drawing })),
              catchError((err) => of(saveCurrentFailure({ error: err?.message ?? 'Save failed' })))
            );
          }),
          catchError((err) => of(saveCurrentFailure({ error: err?.message ?? 'Thumbnail failed' })))
        );
      })
    )
  );

  open$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openDrawingRequested),
      switchMap(({ id }) =>
        this.drawingsService.getById(id).pipe(
          mergeMap((d: Drawing) => [
            openDrawingSuccess({ openedDrawingId: id }),
            setDrawingName({ name: d.name }),
            setDrawingDimensions({ width: d.width, height: d.height }),
            loadLayers({ drawingId: String(d.id) }),
          ]),
          catchError((error) => of(openDrawingFailure({ error })))
        )
      )
    )
  );
}
