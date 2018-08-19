import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewControlsComponent } from './view-controls.component';

describe('ViewControlsComponent', () => {
  let component: ViewControlsComponent;
  let fixture: ComponentFixture<ViewControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
