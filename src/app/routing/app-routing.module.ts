import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigResolver } from './config-resolver.service';
import { UserFrameComponent } from '../components/common/content-frame/content-frame.component';
import { QuadrantComponent } from '../components/task/quadrant/quadrant.component';
import { VerticalListComponent } from '../components/task/vertical-list/vertical-list.component';
import { AboutComponent } from '../components/common/about/about.component';
import { TaskFrameComponent } from '../components/task/task-frame/task-frame.component';

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
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: '',
        component: TaskFrameComponent,
        children: [
          {
            path: 'quadrant',
            component: QuadrantComponent
          },{
            path: 'vertical-list',
            component: VerticalListComponent
          }
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