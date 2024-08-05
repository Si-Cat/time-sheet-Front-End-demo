import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLoadTableComponent } from './work-load-table.component';

describe('WorkLoadTableComponent', () => {
  let component: WorkLoadTableComponent;
  let fixture: ComponentFixture<WorkLoadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkLoadTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkLoadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
