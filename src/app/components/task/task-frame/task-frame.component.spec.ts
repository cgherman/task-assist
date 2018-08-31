import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFrameComponent } from './task-frame.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TaskFrameComponent', () => {
  let component: TaskFrameComponent;
  let fixture: ComponentFixture<TaskFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
         TaskFrameComponent 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
