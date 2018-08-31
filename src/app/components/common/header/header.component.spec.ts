import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ViewControlsComponent } from '../view-controls/view-controls.component';
import { AuthControlsComponent } from '../../auth/auth-controls/auth-controls.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAuthServiceBase } from '../../../services/auth/google-auth-service-base';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';
import { MockAuthServiceBase } from '../../../mocks/mock-auth-service-base';
import { MockCrossComponentEventService } from '../../../mocks/mock-cross-component-event-service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService;
  let mockCrossService;

  beforeEach(async(() => {
    mockAuthService = new MockAuthServiceBase();
    mockCrossService = new MockCrossComponentEventService();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ 
        HeaderComponent,
        ViewControlsComponent,
        AuthControlsComponent
      ],
      providers: [
        { provide: GoogleAuthServiceBase, useValue: mockAuthService },
        { provide: CrossComponentEventService, useValue: mockCrossService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
