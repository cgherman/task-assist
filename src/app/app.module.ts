import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

import { DragulaModule } from 'ng2-dragula';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';

import { AuthService } from './auth.service';
import { AuthServiceBase } from './auth-service-base';
import { TaskService } from './task.service';
import { TaskServiceBase } from './task-service-base';
import { TaskModifierService } from './task-modifier.service';
import { TaskModifierServiceBase } from './task-modifier-service-base';
import { ConfigService } from './config.service';
import { FrameComponent } from './frame/frame.component';


@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    QuadrantComponent
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
              { provide: ConfigService, useClass: ConfigService }],
  bootstrap: [AppComponent]
})

export class AppModule { }
