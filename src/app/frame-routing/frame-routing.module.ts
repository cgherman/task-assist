import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuadrantComponent } from '../quadrant/quadrant.component';

const frameRoutes: Routes = [
  { path: 'quadrant',  component: QuadrantComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(frameRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FrameRoutingModule { }
