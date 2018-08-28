import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_LIST } from '../../../user-messages';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';
import { TaskComponentBase } from '../../task/task-component-base';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { ITaskInListWithState } from '../../../models/task/itask-in-list-with-state';
import { DataState } from '../../../models/task/data-state.enum';
import { Quadrant } from '../../../models/task/quadrant';


@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css', '../task-component-base.css']
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

    var sub = this.taskService.taskQuadrantDataEvent.subscribe(taskInListWithState => this.onTaskQuadrantUpdated(taskInListWithState));
    this.subscriptions.push(sub); // capture for destruction

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

  protected executeMenuAction(taskId: string, taskListId: string, targetQuadrant: Quadrant) {
    this.taskService.updateTaskQuadrant(taskId, taskListId, targetQuadrant);
  }

  private onTaskQuadrantUpdated(taskInListWithState: ITaskInListWithState) {
    // Update model with committed data
    if (taskInListWithState.dataState == DataState.Committed) {
      this.loadTasks(this.selectedTaskList, false);
    }
  }
}
