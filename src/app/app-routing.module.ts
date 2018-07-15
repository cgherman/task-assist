import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuadrantComponent } from './quadrant/quadrant.component';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/quadrant', pathMatch: 'full' },
  { path: 'quadrant', component: QuadrantComponent, canActivate: [CanActivateViaAuthGuard] }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}