import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeEditor } from './stroke-editor';

describe('StrokeEditor', () => {
  let component: StrokeEditor;
  let fixture: ComponentFixture<StrokeEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrokeEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrokeEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
