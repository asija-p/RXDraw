import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Layers } from './layers';

describe('Layers', () => {
  let component: Layers;
  let fixture: ComponentFixture<Layers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Layers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
