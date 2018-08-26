import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { DragulaService } from 'ng2-dragula';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_QUAD } from '../../../user-messages';
import { TaskComponentBase } from '../task-component-base';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { CachedGoogleTaskService } from '../../../services/task/cached-google-task.service';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';


@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css', '../task-component-base.css'],
  providers:  [[DragulaService],
               { provide: QuadTaskServiceBase, useClass: CachedGoogleTaskService }]
})
export class QuadrantComponent extends TaskComponentBase implements OnInit, OnDestroy {

  // Dragula options
  dragulaOptions: any = {
    revertOnSpill: true,
    removeOnSpill: false,
    copy: false,
    ignoreInputTextSelection: true
  }
  
  constructor(formBuilder: FormBuilder,
              taskService: QuadTaskServiceBase,
              authService: AuthServiceBase,
              crossComponentEventService: CrossComponentEventService,
              private dragulaService: DragulaService) {
    super(formBuilder, taskService, authService, crossComponentEventService);
  }

  ngOnInit() {
    this.wireUpEvents();

    // tweak title based on component usage
    this.requestTitleChange(MSG_TITLE_QUAD);

    // Init Dragula drag-n-drop
    var sub = this.dragulaService.drop.subscribe(args => this.onDrop(args));
    this.subscriptions.push(sub); // capture for destruction
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

  onDrop(args) {
    let [bagName, element, target, source] = args;
    var quadrantOld = source.id.substring(target.id.length - 1)
    var targetQuadrant = target.id.substring(target.id.length - 1)

    console.log("Requested move of element " + element.id + " (" + quadrantOld + "->" + targetQuadrant + ")");

    // Get Dragula "drake" API reference (ng2-dragula doc refers to dragula)
    // https://github.com/bevacqua/dragula#readme
    var drake = this.dragulaService.find('taskBag').drake;

    // Write update to API and refresh data model
    this.taskService.updateTaskQuadrantByChar(element.id, this.selectedTaskList, targetQuadrant);
  }
}
