import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_LIST } from '../../../user-messages';
import { TaskComponentBase } from '../../task/task-component-base';
import { TaskModifierServiceBase } from '../../../services/task/task-modifier-service-base';
import { TaskServiceBase } from '../../../services/task/task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { TaskService } from '../../../services/task/task.service';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';


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
              authService: AuthServiceBase,
              crossComponentEventService: CrossComponentEventService) {
    super(formBuilder, taskService, taskModifierService, authService, crossComponentEventService);
  }

  ngOnInit() {
    this.wireUpEvents();

    // tweak title based on component usage
    this.requestTitleChange(MSG_TITLE_LIST);
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngDoCheck() {
  }

  // fired upon task list selection
  onChangeTaskList() {
    // call super.loadTaskList();
    this.loadTaskList();
  }
}
