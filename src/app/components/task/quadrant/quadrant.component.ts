import { Component, OnInit, OnDestroy } from '@angular/core';

import { DragulaService, dragula } from 'ng2-dragula';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_QUAD } from '../../../user-messages';
import { TaskComponentBase } from '../task-component-base';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';
import { Quadrant } from '../../../models/task/quadrant';
import { TaskFrameComponent } from '../task-frame/task-frame.component';


@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css', '../task-component-base.css']
})
export class QuadrantComponent extends TaskComponentBase implements OnInit, OnDestroy {
  // Dragula options
  dragulaOptions: any = {
    revertOnSpill: true,
    removeOnSpill: false,
    copy: false,
    ignoreInputTextSelection: true
  }
  
  constructor(taskFrame: TaskFrameComponent,
              taskService: QuadTaskServiceBase,
              crossComponentEventService: CrossComponentEventService,
              private dragulaService: DragulaService) {
    super(taskFrame, taskService, crossComponentEventService);
  }

  ngOnInit() {
    this.wireUpCommonInit();

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

  onDrop(args) {
    let [bagName, element, target, source] = args;
    var quadrantOld = source.id.substring(target.id.length - 1)
    var targetQuadrant = target.id.substring(target.id.length - 1)

    console.log("Requested move of element " + element.id + " (" + quadrantOld + "->" + targetQuadrant + ")");

    // Write update to API and refresh data model
    this.taskService.updateTaskQuadrantByChar(element.id, this.taskFrame.selectedTaskList, targetQuadrant);
  }

  protected executeMenuAction(taskId: string, taskListId: string, targetQuadrant: Quadrant) {
    this.dragulaManualMove(taskId, targetQuadrant);
  }

  private dragulaManualMove(taskId: string, targetQuadrant: Quadrant) {
    var drake = this.getDrake();
    var quadDivName: string = "QUAD" + targetQuadrant.selection;
    var elContainer = document.getElementById(quadDivName);
    var elTask = document.getElementById(taskId);

    drake.start(elTask);
    elContainer.appendChild(elTask);
    drake.end();
  }

  private getDrake() {
    // Get Dragula "drake" API reference (ng2-dragula doc refers to dragula)
    // https://github.com/bevacqua/dragula#readme
    return this.dragulaService.find('taskBag').drake;
  }
}
