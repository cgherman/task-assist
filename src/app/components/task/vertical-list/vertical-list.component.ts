import { Component, OnInit, OnDestroy, NgModule, Input } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_LIST } from '../../../user-messages';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';
import { TaskComponentBase } from '../../task/task-component-base';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { ITaskInListWithState } from '../../../models/task/itask-in-list-with-state';
import { DataState } from '../../../models/task/data-state.enum';
import { Quadrant } from '../../../models/task/quadrant';
import { TaskFrameComponent } from '../task-frame/task-frame.component';


@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css', '../task-component-base.css']
})
export class VerticalListComponent extends TaskComponentBase implements OnInit, OnDestroy {
  constructor(taskFrame: TaskFrameComponent,
              taskService: QuadTaskServiceBase,
              crossComponentEventService: CrossComponentEventService) {
    super(taskFrame, taskService, crossComponentEventService);
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

  protected executeMenuAction(taskId: string, taskListId: string, targetQuadrant: Quadrant) {
    this.taskService.updateTaskQuadrant(taskId, taskListId, targetQuadrant);
  }

  private onTaskQuadrantUpdated(taskInListWithState: ITaskInListWithState) {
    // Update model with committed data
    if (taskInListWithState.dataState == DataState.Committed) {
      this.loadTasks(this.taskFrame.selectedTaskList, false);
    }
  }
}
