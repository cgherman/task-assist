import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthControlsComponent } from './auth-controls.component';
import { GoogleAuthServiceBase } from '../../../services/auth/google-auth-service-base';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';

import { MockAuthServiceBase } from '../../../mocks/mock-auth-service-base';
import { MockCrossComponentEventService } from '../../../mocks/mock-cross-component-event-service';

describe('AuthControlsComponent', () => {
  let component: AuthControlsComponent;
  let fixture: ComponentFixture<AuthControlsComponent>;
  let mockAuthService;
  let mockCrossService;

  beforeEach(async(() => {
    mockAuthService = new MockAuthServiceBase();
    mockCrossService = new MockCrossComponentEventService();

    TestBed.configureTestingModule({
      declarations: [
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
    fixture = TestBed.createComponent(AuthControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render Sign In and Sign Out buttons', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    let foundSignIn: number = 0;
    let foundSignOut: number = 0;

    let elements = compiled.querySelectorAll('button');
    elements.forEach(element => {
      if (element.textContent.indexOf('Sign Out') >= 0) {
        foundSignOut++;
      }
      if (element.textContent.indexOf('Sign In') >= 0) {
        foundSignIn++;
      }
    });

    elements = compiled.querySelectorAll('div');
    elements.forEach(element => {
      console.log(element.textContent);
      if (element.textContent.indexOf('Sign Out') >= 0) {
        foundSignOut++;
      }
      if (element.textContent.indexOf('Sign In') >= 0) {
        foundSignIn++;
      }
    });

    expect(foundSignOut).toBeGreaterThan(0);
    expect(foundSignIn).toBeGreaterThan(0);
  }));

});