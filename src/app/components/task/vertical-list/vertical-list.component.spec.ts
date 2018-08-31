import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalListComponent } from './vertical-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material';
import { LinkifyLinksDirective } from '../linkify-links.directive';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { MockAuthServiceBase } from '../../../mocks/mock-auth-service-base';
import { MockQuadTaskServiceBase } from '../../../mocks/mock-quad-task-service-base';

describe('VerticalListComponent', () => {
  let component: VerticalListComponent;
  let fixture: ComponentFixture<VerticalListComponent>;
  let mockAuthService;
  let mockQuadTaskServiceBase;

  beforeEach(async(() => {
    mockAuthService = new MockAuthServiceBase();
    mockQuadTaskServiceBase = new MockQuadTaskServiceBase();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ 
        VerticalListComponent,
        MatMenu,
        MatMenuTrigger,
        LinkifyLinksDirective
      ],
      providers: [
        { provide: QuadTaskServiceBase, useValue: mockQuadTaskServiceBase },
        { provide: AuthServiceBase, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  }));

  //constructor(protected formBuilder: FormBuilder,
    //protected taskService: QuadTaskServiceBase,
    //protected authService: AuthServiceBase,
    //protected crossComponentEventService: CrossComponentEventService

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
