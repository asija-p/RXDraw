import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDrawing } from './settings-drawing';

describe('SettingsDrawing', () => {
  let component: SettingsDrawing;
  let fixture: ComponentFixture<SettingsDrawing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsDrawing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsDrawing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
