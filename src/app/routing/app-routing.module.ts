import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFrameComponent } from '../components/common/user-frame/user-frame.component';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';
import { ConfigResolver } from './config-resolver.service';
import { QuadrantComponent } from '../components/task/quadrant/quadrant.component';
import { VerticalListComponent } from '../components/task/vertical-list/vertical-list.component';
import { AboutComponent } from '../components/common/about/about.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/quadrant', 
    pathMatch: 'full',
  }, {
    path: '', 
    component: UserFrameComponent, 
    canActivate: [CanActivateViaAuthGuard], 
    resolve: {
      config: ConfigResolver
    },
    children: [ {
        path: 'quadrant',
        component: QuadrantComponent
      },{
        path: 'vertical-list',
        component: VerticalListComponent
      },{
        path: 'about',
        component: AboutComponent
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