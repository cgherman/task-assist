import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule, MatInputModule, MatButtonModule, MatMenuModule, MatFormField } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { DragulaModule } from 'ng2-dragula';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';

import { AppComponent } from './components/app.component';
import { TaskFrameComponent } from './components/task/task-frame/task-frame.component';
import { QuadrantComponent } from './components/task/quadrant/quadrant.component';
import { VerticalListComponent } from './components/task/vertical-list/vertical-list.component';
import { UserFrameComponent } from './components/common/user-frame/user-frame.component';
import { ViewControlsComponent } from './components/common/view-controls/view-controls.component';
import { AboutComponent } from './components/common/about/about.component';
import { HeaderComponent } from './components/common/header/header.component';
import { AuthControlsComponent } from './components/auth/auth-controls/auth-controls.component';
import { TaskPanelComponent } from './components/task/task-panel/task-panel.component';
import { TaskPanelsComponent } from './components/task/task-panels/task-panels.component';
import { DelayDragDirective } from './components/delay-drag.directive';
import { LinkifyLinksDirective } from './components/task/linkify-links.directive';

import { AuthServiceBase } from './services/auth/auth-service-base';
import { GoogleAuthServiceBase } from './services/auth/google-auth-service-base';
import { QuadTaskServiceBase } from './services/task/quad-task-service-base';
import { AuthService } from './services/auth/auth.service';
import { GapiWrapperService } from './services/shared/gapi-wrapper.service';
import { FileFetchService } from './services/shared/file-fetch.service';
import { CrossComponentEventService } from './services/shared/cross-component-event.service';
import { ConfigAppService } from './services/config/config-app.service';
import { GoogleTaskService } from './services/task/google-task.service';
import { TaskFrameShared } from './components/task/task-frame/task-frame-shared';
import { TaskExtrasService } from './services/task/task-extras.service';

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
    ViewControlsComponent,
    DelayDragDirective,
    LinkifyLinksDirective,
    TaskFrameComponent,
    TaskPanelComponent,
    TaskPanelsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DragulaModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule
  ],
  providers: [
    { provide: AuthServiceBase, useClass: AuthService },
    { provide: GoogleAuthServiceBase, useClass: AuthService },
    { provide: QuadTaskServiceBase, useClass: GoogleTaskService },
    { provide: FileFetchService, useClass: FileFetchService },
    CrossComponentEventService,
    ConfigAppService,
    GapiWrapperService,
    TaskFrameShared,
    TaskExtrasService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
