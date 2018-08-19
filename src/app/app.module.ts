import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule } from '@angular/material';

import { DragulaModule } from 'ng2-dragula';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';

import { AuthServiceBase } from './services/auth/auth-service-base';
import { GoogleAuthServiceBase } from './services/auth/google-auth-service-base';
import { TaskServiceBase } from './services/task/task-service-base';
import { TaskModifierServiceBase } from './services/task/task-modifier-service-base';
import { TaskModifierService } from './services/task/task-modifier.service';
import { AuthService } from './services/auth/auth.service';
import { TaskService } from './services/task/task.service';
import { GapiWrapperService } from './services/shared/gapi-wrapper.service';
import { FileFetchService } from './services/shared/file-fetch.service';
import { CrossComponentEventService } from './services/shared/cross-component-event.service';
import { ConfigAppService } from './services/config/config-app.service';

import { AppComponent } from './components/app.component';
import { QuadrantComponent } from './components/task/quadrant/quadrant.component';
import { UserFrameComponent } from './components/common/user-frame/user-frame.component';
import { VerticalListComponent } from './components/task/vertical-list/vertical-list.component';
import { AboutComponent } from './components/common/about/about.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFrameComponent,
    QuadrantComponent,
    UserFrameComponent,
    VerticalListComponent,
    AboutComponent,
    HeaderComponent
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
              { provide: FileFetchService, useClass: FileFetchService },
              CrossComponentEventService,
              ConfigAppService,
              GapiWrapperService],
  bootstrap: [AppComponent]
})

export class AppModule { }
