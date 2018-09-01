import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrantComponent } from './quadrant.component';
import { MatMenu, MatMenuTrigger } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LinkifyLinksDirective } from '../linkify-links.directive';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { dragula, DragulaService, DragulaDirective } from 'ng2-dragula';
import { MockAuthServiceBase } from '../../../mocks/mock-auth-service-base';
import { MockQuadTaskServiceBase } from '../../../mocks/mock-quad-task-service-base';
import { TaskFrameComponent } from '../task-frame/task-frame.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskFrameShared } from '../task-frame/task-frame-shared';

describe('QuadrantComponent', () => {
  let component: QuadrantComponent;
  let fixture: ComponentFixture<QuadrantComponent>;
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
        QuadrantComponent,        
        TaskFrameComponent,
        MatMenu,
        MatMenuTrigger,
        LinkifyLinksDirective,
        DragulaDirective
      ],
      providers: [
        { provide: TaskFrameShared, useValue: taskFrameShared },
        { provide: QuadTaskServiceBase, useValue: mockQuadTaskServiceBase },
        { provide: AuthServiceBase, useValue: mockAuthService },
        DragulaService
      ]
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
