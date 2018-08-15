import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFrameComponent } from '../user-frame/user-frame.component';

import { TaskModifierServiceBase } from '../../services/task/task-modifier-service-base';
import { TaskServiceBase } from '../../services/task/task-service-base';
import { TaskService } from '../../services/task/task.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { TaskComponentBase } from '../task-component-base';
import { AuthServiceBase } from '../../services/auth/auth-service-base';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css'],
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
