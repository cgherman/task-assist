import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskComponentBase } from '../task-component-base';
import { TaskModifierServiceBase } from '../../services/task/task-modifier-service-base';
import { TaskServiceBase } from '../../services/task/task-service-base';
import { AuthServiceBase } from '../../services/auth/auth-service-base';
import { TaskService } from '../../services/task/task.service';

import { UserFrameComponent } from '../user-frame/user-frame.component';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css', '../task-component-base.css'],
  providers:  [{ provide: TaskServiceBase, useClass: TaskService }]
})
export class VerticalListComponent extends TaskComponentBase implements OnInit, OnDestroy {
  constructor(formBuilder: FormBuilder,
              taskService: TaskServiceBase, 
              taskModifierService: TaskModifierServiceBase, 
              frameComponent: UserFrameComponent,
              authService: AuthServiceBase) {
    super(formBuilder, taskService, taskModifierService, frameComponent, authService);
  }

  ngOnInit() {
    this.wireUpEvents();

    // tweak title based on component usage
    this.frameComponent.title = "Prioritize Your Tasks: Tap to Move";
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngDoCheck() {
  }

  // fired upon task list selection
  onChangeTaskList($event) {
    this.loadTaskList();
  }

  protected onDataLoaded() {
    this.frameComponent.backgroundGoogleTasksDone();
  }

}
