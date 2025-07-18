import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalArchiveComponent } from './journal-archive.component';

describe('JournalArchiveComponent', () => {
  let component: JournalArchiveComponent;
  let fixture: ComponentFixture<JournalArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
