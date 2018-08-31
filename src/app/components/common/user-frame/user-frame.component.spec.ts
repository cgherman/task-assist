import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFrameComponent } from './user-frame.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAuthServiceBase } from '../../../services/auth/google-auth-service-base';

describe('UserFrameComponent', () => {
  let component: UserFrameComponent;
  let fixture: ComponentFixture<UserFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ 
        UserFrameComponent
      ],
      providers: [
        GoogleAuthServiceBase
      ]
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
