import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDrawing } from './save-drawing';

describe('SaveDrawing', () => {
  let component: SaveDrawing;
  let fixture: ComponentFixture<SaveDrawing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveDrawing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveDrawing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
