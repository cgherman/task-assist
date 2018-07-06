import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

import { DragulaModule } from 'ng2-dragula';
import { TaskService } from './task.service';
import { FakeTaskService } from './fake-task.service';
import { AuthService } from './auth.service'

@NgModule({
  declarations: [
    AppComponent,
    QuadrantComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DragulaModule,
  ],
  providers: [TaskService, AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }
