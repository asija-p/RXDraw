import { Component, ElementRef, ViewChild } from '@angular/core';
import { StrokeEditor } from '../../components/drawing/stroke-editor/stroke-editor';
import { LayersNavigator } from '../../components/drawing/layers-navigator/layers-navigator';
import { Layers } from '../../components/drawing/layers/layers';
import { Navigator } from '../../components/drawing/navigator/navigator';
import { EditorToolbar } from '../../components/drawing/editor-toolbar/editor-toolbar';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SettingsDrawing } from '../../components/drawing/settings-drawing/settings-drawing';

import { fromEvent, map, Observable, take, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  selectIsDrawingReady,
  selectOpenedDrawingId,
} from '../../feature/drawings/store/drawings.selectors';
import { ActivatedRoute } from '@angular/router';
import { openDrawingRequested } from '../../feature/drawings/store/drawings.actions';
import { clearLayers } from '../../feature/layers/store/layers.actions';
import { selectCameraState } from '../../feature/studio/store/drawing.selectors';
import { cameraSet } from '../../feature/studio/store/drawing.actions';

const ZMIN = 0.25;
const ZMAX = 8;
const ZOOM_SENSITIVITY = 0.0015; // tweak to taste (smaller = gentler)

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

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
  @ViewChild('canvasArea', { read: ElementRef }) private canvasAreaRef!: ElementRef<HTMLElement>;

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
  }

  ngOnDestroy() {
    this.settingsRef?.close();
    this.settingsRef = undefined;
  }

  private setupZoom() {
    const el = this.canvasAreaRef.nativeElement;

    const wheel$ = fromEvent<WheelEvent>(el, 'wheel', { passive: false }).pipe(
      tap((ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }),
      map((ev) => {
        const rect = el.getBoundingClientRect();

        const mouseX = ev.clientX - rect.left;
        const mouseY = ev.clientY - rect.top;

        return {
          ev,
          mouseX,
          mouseY,
          deltaY: ev.deltaY,
        };
      })
    );

    const zoomAtCursor$ = wheel$.pipe(
      withLatestFrom(this.store.select(selectCameraState)),
      map(([e, cam]) => {
        const { mouseX, mouseY, deltaY } = e;
        const oldZoom = cam.zoom;
        const factor = Math.exp(-deltaY * ZOOM_SENSITIVITY);
        const newZoom = clamp(oldZoom * factor, ZMIN, ZMAX);
        const appliedFactor = newZoom / oldZoom;

        const newPanX = mouseX - (mouseX - cam.panX) * appliedFactor;
        const newPanY = mouseY - (mouseY - cam.panY) * appliedFactor;

        return { zoom: newZoom, panX: newPanX, panY: newPanY };
      })
    );

    zoomAtCursor$.subscribe(({ zoom, panX, panY }) => {
      this.store.dispatch(cameraSet({ zoom, panX, panY }));
    });
  }

  private openSettings() {
    if (this.settingsRef) return;
    this.settingsRef = this.dialog.open(SettingsDrawing);
  }
}
