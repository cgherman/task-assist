import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewControlsComponent } from './view-controls.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ViewControlsComponent', () => {
  let component: ViewControlsComponent;
  let fixture: ComponentFixture<ViewControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ 
        ViewControlsComponent 
      ]
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
