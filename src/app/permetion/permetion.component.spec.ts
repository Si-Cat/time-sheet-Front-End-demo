import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermetionComponent } from './permetion.component';

describe('PermetionComponent', () => {
  let component: PermetionComponent;
  let fixture: ComponentFixture<PermetionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermetionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
