import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

import { DragulaModule } from 'ng2-dragula';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';

import { AuthService } from './services/auth.service';
import { AuthServiceBase } from './services/auth-service-base';
import { TaskService } from './services/task.service';
import { TaskServiceBase } from './services/task-service-base';
import { TaskModifierService } from './services/task-modifier.service';
import { TaskModifierServiceBase } from './services/task-modifier-service-base';
import { GapiWrapperService } from './services/gapi-wrapper.service';
import { ConfigService } from './services/config.service';
import { UserFrameComponent } from './user-frame/user-frame.component';


@NgModule({
  declarations: [
    AppComponent,
    UserFrameComponent,
    QuadrantComponent,
    UserFrameComponent
  ],
  imports: [

    BrowserModule,
    ReactiveFormsModule,
    DragulaModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [{ provide: AuthServiceBase, useClass: AuthService },
              { provide: TaskModifierServiceBase, useClass: TaskModifierService },
              { provide: TaskServiceBase, useClass: TaskService },
              { provide: ConfigService, useClass: ConfigService },
              GapiWrapperService],
  bootstrap: [AppComponent]
})

export class AppModule { }
