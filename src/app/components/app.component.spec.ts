import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { ViewControlsComponent } from './common/view-controls/view-controls.component';
import { AuthControlsComponent } from './auth/auth-controls/auth-controls.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAuthServiceBase } from '../services/auth/google-auth-service-base';
import { MockAuthServiceBase } from '../mocks/mock-auth-service-base';
import { AuthServiceBase } from '../services/auth/auth-service-base';

describe('AppComponent', () => {
  let mockAuthService;

  beforeEach(async(() => {
    mockAuthService = new MockAuthServiceBase();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        ViewControlsComponent,
        AuthControlsComponent
      ],
      providers: [
        { provide: GoogleAuthServiceBase, useValue: mockAuthService }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'TaskAssist'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('TaskAssist');
  }));
});
