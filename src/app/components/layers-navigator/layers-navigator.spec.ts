import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersNavigator } from './layers-navigator';

describe('Layers', () => {
  let component: LayersNavigator;
  let fixture: ComponentFixture<LayersNavigator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersNavigator],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersNavigator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
