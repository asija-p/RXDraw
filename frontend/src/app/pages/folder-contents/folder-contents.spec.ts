import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderContents } from './folder-contents';

describe('FolderContents', () => {
  let component: FolderContents;
  let fixture: ComponentFixture<FolderContents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderContents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderContents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
