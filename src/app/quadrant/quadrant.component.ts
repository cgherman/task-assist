import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserFrameComponent } from '../user-frame/user-frame.component';
import { TaskComponentBase } from '../task-component-base';
import { TaskModifierServiceBase } from '../services/task-modifier-service-base';
import { TaskServiceBase } from '../services/task-service-base';
import { TaskService } from '../services/task.service';

import { DragulaService } from 'ng2-dragula';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { AuthServiceBase } from '../services/auth-service-base';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[DragulaService],
               { provide: TaskServiceBase, useClass: TaskService }]
})
  
export class QuadrantComponent extends TaskComponentBase implements OnInit, OnDestroy {
  @ViewChild('triggerRefresh') triggerRefresh: ElementRef;

  // Dragula options
  dragulaOptions: any = {
    revertOnSpill: true,
    removeOnSpill: false,
    copy: false,
    ignoreInputTextSelection: true
  }
  
  constructor(formBuilder: FormBuilder,
              taskService: TaskServiceBase, 
              taskModifierService: TaskModifierServiceBase, 
              frameComponent: UserFrameComponent,
              authService: AuthServiceBase,
              private dragulaService: DragulaService) {
    super(formBuilder, taskService, taskModifierService, frameComponent, authService);
  }

  ngOnInit() {
    this.wireUpEvents();

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
    this.loadTaskList();
  }

  onDataLoaded() {
    // Trigger UI update to notify Angular of GAPI model
    // This is preferable to polling GAPI (polling from ngOnInit does work)
    // Method markForCheck() is not effective at this stage
    this.triggerRefresh.nativeElement.click();
  }

  // Triggered by triggerRefresh event
  onRefresh() {
    // TODO: Handle any necessary user dialog here
  }

  onDrop(args) {
    let [bagName, element, target, source] = args;
    var quadrantOld = source.id.substring(target.id.length - 1)
    var targetQuadrant = target.id.substring(target.id.length - 1)

    console.log("Requested move of element " + element.id + " (" + quadrantOld + "->" + targetQuadrant + ")");

    // Get Dragula "drake" API reference (ng2-dragula doc refers to dragula)
    // https://github.com/bevacqua/dragula#readme
    var drake = this.dragulaService.find('taskBag').drake;

    // Undo the Dragula div update to prevent rendering errors
    drake.cancel(true);

    // Write update to API and refresh data model
    this.taskModifierService.updateTaskQuadrant(this.taskService, element.id, this.selectedTaskList, targetQuadrant);
  }
}
