import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WlcComponent } from './wlc.component';

describe('WlcComponent', () => {
  let component: WlcComponent;
  let fixture: ComponentFixture<WlcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WlcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
