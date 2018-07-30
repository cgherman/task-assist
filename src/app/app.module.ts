import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule } from '@angular/material';

import { AppComponent } from './app.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

import { DragulaModule } from 'ng2-dragula';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';

import { AuthServiceBase } from './services/auth-service-base';
import { GoogleAuthServiceBase } from './services/google-auth-service-base';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { TaskServiceBase } from './services/task-service-base';
import { TaskModifierService } from './services/task-modifier.service';
import { TaskModifierServiceBase } from './services/task-modifier-service-base';
import { GapiWrapperService } from './services/gapi-wrapper.service';
import { ConfigService } from './services/config.service';
import { UserFrameComponent } from './user-frame/user-frame.component';
import { VerticalListComponent } from './vertical-list/vertical-list.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFrameComponent,
    QuadrantComponent,
    UserFrameComponent,
    VerticalListComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DragulaModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule
  ],
  providers: [{ provide: AuthServiceBase, useClass: AuthService },
              { provide: GoogleAuthServiceBase, useClass: AuthService },
              { provide: TaskModifierServiceBase, useClass: TaskModifierService },
              { provide: TaskServiceBase, useClass: TaskService },
              { provide: ConfigService, useClass: ConfigService },
              GapiWrapperService],
  bootstrap: [AppComponent]
})

export class AppModule { }
