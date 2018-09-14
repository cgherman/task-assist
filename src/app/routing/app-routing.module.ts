import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigResolver } from './config-resolver.service';
import { UserFrameComponent } from '../components/common/user-frame/user-frame.component';
import { QuadrantComponent } from '../components/task/quadrant/quadrant.component';
import { VerticalListComponent } from '../components/task/vertical-list/vertical-list.component';
import { AboutComponent } from '../components/common/about/about.component';
import { TaskFrameComponent } from '../components/task/task-frame/task-frame.component';
import { TaskPanelsComponent } from '../components/task/task-panels/task-panels.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/quadrant', 
    pathMatch: 'full',
  }, {
    path: '',
    resolve: { config: ConfigResolver },
    component: UserFrameComponent,    
    children: [
      { path: 'about', component: AboutComponent },
      {
        path: '',
        component: TaskFrameComponent,
        children: [
          { path: 'quadrant', component: QuadrantComponent },
          { path: 'vertical-list', component: VerticalListComponent },
          { path: 'task-panels', component: TaskPanelsComponent },
          { path: 'task-panels/:id', component: TaskPanelsComponent }
        ]
      }
    ]
  }
];


@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ],
  providers: [ ConfigResolver ]
})

export class AppRoutingModule {
  constructor(){}
}