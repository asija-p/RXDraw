import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingEditor } from './drawing-editor';

describe('DrawingEditor', () => {
  let component: DrawingEditor;
  let fixture: ComponentFixture<DrawingEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawingEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
