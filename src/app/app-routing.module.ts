import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFrameComponent } from './user-frame/user-frame.component';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';
import { ConfigResolver } from './resolvers/config-resolver.service';
import { QuadrantComponent } from './quadrant/quadrant.component';
import { VerticalListComponent } from './vertical-list/vertical-list.component';
import { AboutComponent } from './about/about.component';

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