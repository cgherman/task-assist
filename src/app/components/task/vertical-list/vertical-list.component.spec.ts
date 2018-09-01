import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalListComponent } from './vertical-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material';
import { LinkifyLinksDirective } from '../linkify-links.directive';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { MockAuthServiceBase } from '../../../mocks/mock-auth-service-base';
import { MockQuadTaskServiceBase } from '../../../mocks/mock-quad-task-service-base';
import { TaskFrameComponent } from '../task-frame/task-frame.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskFrameShared } from '../task-frame/task-frame-shared';

describe('VerticalListComponent', () => {
  let component: VerticalListComponent;
  let fixture: ComponentFixture<VerticalListComponent>;
  let mockAuthService;
  let mockQuadTaskServiceBase;
  let taskFrameShared;

  beforeEach(async(() => {
    mockAuthService = new MockAuthServiceBase();
    mockQuadTaskServiceBase = new MockQuadTaskServiceBase();
    taskFrameShared = new TaskFrameShared();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ 
        VerticalListComponent,
        TaskFrameComponent,
        MatMenu,
        MatMenuTrigger,
        LinkifyLinksDirective
      ],
      providers: [
        { provide: TaskFrameShared, useValue: taskFrameShared },
        { provide: QuadTaskServiceBase, useValue: mockQuadTaskServiceBase },
        { provide: AuthServiceBase, useValue: mockAuthService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
