import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrantComponent } from './quadrant.component';

describe('QuadrantComponent', () => {
  let component: QuadrantComponent;
  let fixture: ComponentFixture<QuadrantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuadrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
