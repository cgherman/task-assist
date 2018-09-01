import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFrameComponent } from './task-frame.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { MockQuadTaskServiceBase } from '../../../mocks/mock-quad-task-service-base';
import { TaskFrameShared } from './task-frame-shared';

describe('TaskFrameComponent', () => {
  let component: TaskFrameComponent;
  let fixture: ComponentFixture<TaskFrameComponent>;
  let mockQuadTaskServiceBase;
  let taskFrameShared;

  beforeEach(async(() => {
    mockQuadTaskServiceBase = new MockQuadTaskServiceBase();
    taskFrameShared = new TaskFrameShared();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
         TaskFrameComponent 
      ],
      providers: [
        { provide: TaskFrameShared, useValue: taskFrameShared },
        { provide: QuadTaskServiceBase, useValue: mockQuadTaskServiceBase }
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
