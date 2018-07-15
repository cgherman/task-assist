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
import { TaskServiceBase } from './task-service-base';
import { TaskService } from './task.service';


@NgModule({
  declarations: [
    AppComponent,
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
    { provide: TaskServiceBase, useClass: TaskService }],
  bootstrap: [AppComponent]
})

export class AppModule { }
