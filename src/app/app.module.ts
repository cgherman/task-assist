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
import { QuadTaskServiceBase } from './services/task/quad-task-service-base';
import { AuthService } from './services/auth/auth.service';
import { CachedGoogleTaskService } from './services/task/cached-google-task.service';
import { GapiWrapperService } from './services/shared/gapi-wrapper.service';
import { FileFetchService } from './services/shared/file-fetch.service';
import { CrossComponentEventService } from './services/shared/cross-component-event.service';
import { ConfigAppService } from './services/config/config-app.service';

import { AppComponent } from './components/app.component';
import { QuadrantComponent } from './components/task/quadrant/quadrant.component';
import { UserFrameComponent } from './components/common/content-frame/content-frame.component';
import { VerticalListComponent } from './components/task/vertical-list/vertical-list.component';
import { AboutComponent } from './components/common/about/about.component';
import { HeaderComponent } from './components/common/header/header.component';
import { AuthControlsComponent } from './components/auth/auth-controls/auth-controls.component';
import { ViewControlsComponent } from './components/common/view-controls/view-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFrameComponent,
    QuadrantComponent,
    UserFrameComponent,
    VerticalListComponent,
    AboutComponent,
    HeaderComponent,
    AuthControlsComponent,
    ViewControlsComponent
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
              { provide: QuadTaskServiceBase, useClass: CachedGoogleTaskService },
              { provide: FileFetchService, useClass: FileFetchService },
              CrossComponentEventService,
              ConfigAppService,
              GapiWrapperService],
  bootstrap: [AppComponent]
})

export class AppModule { }
