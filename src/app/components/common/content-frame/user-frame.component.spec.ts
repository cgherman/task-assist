import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFrameComponent } from './content-frame.component';

describe('UserFrameComponent', () => {
  let component: UserFrameComponent;
  let fixture: ComponentFixture<UserFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
