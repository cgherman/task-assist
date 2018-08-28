import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_LIST } from '../../../user-messages';
import { TaskComponentBase } from '../../task/task-component-base';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { CachedGoogleTaskService } from '../../../services/task/cached-google-task.service';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';


@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css', '../task-component-base.css'],
  providers:  [{ provide: QuadTaskServiceBase, useClass: CachedGoogleTaskService }]
})
export class VerticalListComponent extends TaskComponentBase implements OnInit, OnDestroy {
  constructor(formBuilder: FormBuilder,
              taskService: QuadTaskServiceBase,
              authService: AuthServiceBase,
              crossComponentEventService: CrossComponentEventService) {
    super(formBuilder, taskService, authService, crossComponentEventService);
  }

  ngOnInit() {
    this.wireUpCommonInit();

    // tweak title based on component usage
    this.requestTitleChange(MSG_TITLE_LIST);
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngDoCheck() {
  }

  // fired upon task list selection
  onChangeTaskList($event) {
    // call super.loadTaskList();
    this.loadTaskList();
  }
}
