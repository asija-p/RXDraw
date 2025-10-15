import { Component, ElementRef, ViewChild } from '@angular/core';
import { StrokeEditor } from '../../components/drawing/stroke-editor/stroke-editor';
import { LayersNavigator } from '../../components/drawing/layers-navigator/layers-navigator';
import { Layers } from '../../components/drawing/layers/layers';
import { Navigator } from '../../components/drawing/navigator/navigator';
import { EditorToolbar } from '../../components/drawing/editor-toolbar/editor-toolbar';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SettingsDrawing } from '../../components/drawing/settings-drawing/settings-drawing';

import {
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  Subscription,
  take,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  selectIsDrawingReady,
  selectOpenedDrawingId,
} from '../../feature/drawings/store/drawings.selectors';
import { ActivatedRoute } from '@angular/router';
import {
  clearDrawings,
  openDrawingRequested,
  resetDrawingState,
  saveDrawingRequested,
} from '../../feature/drawings/store/drawings.actions';
import { clearLayers } from '../../feature/layers/store/layers.actions';
import { selectCameraState } from '../../feature/studio/store/drawing.selectors';
import {
  cameraSet,
  redoHistoryStep,
  undoHistoryStep,
} from '../../feature/studio/store/drawing.actions';
import { SaveDrawing } from '../../components/drawing/save-drawing/save-drawing';

const ZMIN = 0.25;
const ZMAX = 8;
const ZOOM_SENSITIVITY = 0.0015;

@Component({
  selector: 'app-drawing-editor',
  imports: [
    StrokeEditor,
    LayersNavigator,
    Navigator,
    EditorToolbar,
    MatDialogModule,
    Layers,
    CommonModule,
  ],
  templateUrl: './drawing-editor.html',
  styleUrl: './drawing-editor.scss',
  standalone: true,
})
export class DrawingEditor {
  private settingsRef?: MatDialogRef<SettingsDrawing>;
  private subs = new Subscription();
  @ViewChild('canvasArea', { read: ElementRef }) private canvasAreaRef!: ElementRef<HTMLElement>;
  @ViewChild(EditorToolbar) private toolbar!: EditorToolbar;
  leftOpen = false;
  rightOpen = false;

  constructor(private store: Store, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.store.dispatch(openDrawingRequested({ id }));
    } else {
      this.openSettings();
    }
  }

  ngAfterViewInit() {
    this.setupZoom();
    this.setupUndoRedoMerge();
    this.setupSaveMerge();
  }

  ngOnDestroy() {
    this.settingsRef?.close();
    this.settingsRef = undefined;

    this.subs.unsubscribe();

    this.store.dispatch(clearLayers());
    this.store.dispatch(clearDrawings());
    this.store.dispatch(resetDrawingState());

    this.store.dispatch(cameraSet({ zoom: 1, panX: 0, panY: 0 }));
  }

  private setupZoom() {
    const el = this.canvasAreaRef.nativeElement;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    this.subs.add(
      fromEvent<WheelEvent>(el, 'wheel', { passive: false }).subscribe((ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const rect = el.getBoundingClientRect();
        const mouseX = ev.clientX - rect.left;
        const mouseY = ev.clientY - rect.top;
        const deltaY = ev.deltaY;

        this.store
          .select(selectCameraState)
          .pipe(take(1))
          .subscribe((cam) => {
            const oldZoom = cam.zoom;
            const newZoom = clamp(oldZoom * Math.exp(-deltaY * ZOOM_SENSITIVITY), ZMIN, ZMAX);
            const applied = newZoom / oldZoom;

            const panX = mouseX - (mouseX - cam.panX) * applied;
            const panY = mouseY - (mouseY - cam.panY) * applied;

            this.store.dispatch(cameraSet({ zoom: newZoom, panX, panY }));
          });
      })
    );
  }

  private setupUndoRedoMerge() {
    const key$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
      filter((ev) => {
        const t = ev.target as HTMLElement | null;
        const tag = (t?.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || t?.isContentEditable;
        return !typing && (ev.ctrlKey || ev.metaKey);
      }),
      map((ev) => {
        const k = ev.key.toLowerCase();
        if (k === 'z' && !ev.shiftKey) return 'undo';
        if (k === 'y' || (k === 'z' && ev.shiftKey)) return 'redo';
        return null;
      }),
      filter((x): x is 'undo' | 'redo' => x !== null)
    );

    const toolbarUndo$ = this.toolbar.undoClick.pipe(map(() => 'undo' as const));
    const toolbarRedo$ = this.toolbar.redoClick.pipe(map(() => 'redo' as const));

    const intent$ = merge(key$, toolbarUndo$, toolbarRedo$);

    this.subs.add(
      intent$.subscribe((intent) => {
        if (intent === 'undo') this.store.dispatch(undoHistoryStep());
        else this.store.dispatch(redoHistoryStep());
      })
    );
  }
  private setupSaveMerge() {
    const key$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
      filter((ev) => {
        const t = ev.target as HTMLElement | null;
        const tag = (t?.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || t?.isContentEditable;
        return !typing && (ev.ctrlKey || ev.metaKey);
      }),
      map((ev) => {
        const k = ev.key.toLowerCase();
        if (k === 's') {
          ev.preventDefault();
          return ev.shiftKey ? 'saveAs' : 'save';
        }
        return null;
      }),
      filter((x): x is 'save' | 'saveAs' => x !== null)
    );

    const toolbarSave$ = this.toolbar.saveClick.pipe(map(() => 'save' as const));
    const toolbarSaveAs$ = this.toolbar.saveAsClick.pipe(map(() => 'saveAs' as const));

    const intent$ = merge(key$, toolbarSave$, toolbarSaveAs$);

    this.subs.add(
      intent$.subscribe((intent) => {
        this.store
          .select(selectOpenedDrawingId)
          .pipe(take(1))
          .subscribe((openedId) => {
            const hasOpened = !!openedId;

            if (intent === 'saveAs') {
              if (hasOpened) {
                this.store.dispatch(saveDrawingRequested({}));
              } else {
                this.dialog.open(SaveDrawing);
              }
              return;
            }
            if (hasOpened) {
              this.store.dispatch(saveDrawingRequested({}));
            } else {
              this.dialog.open(SaveDrawing);
            }
          });
      })
    );
  }

  private openSettings() {
    if (this.settingsRef) return;
    this.settingsRef = this.dialog.open(SettingsDrawing, {
      disableClose: true,
    });
  }
}
