import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignFolder } from './design-folder';

describe('DesignFolder', () => {
  let component: DesignFolder;
  let fixture: ComponentFixture<DesignFolder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignFolder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignFolder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
