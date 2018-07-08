import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

import { DragulaModule } from 'ng2-dragula';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';


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
    RouterModule.forRoot([
      {
        path: 'quadrant',
        component: QuadrantComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
    ])
  ],
  providers: [AuthService, CanActivateViaAuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
