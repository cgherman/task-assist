import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFrameComponent } from '../user-frame/user-frame.component';

import { TaskModifierServiceBase } from '../services/task-modifier-service-base';
import { TaskServiceBase } from '../services/task-service-base';
import { TaskService } from '../services/task.service';
import { ITaskList } from '../models/itask-list';
import { ITask } from '../models/itask';

import { DragulaService } from 'ng2-dragula';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css'],
  providers:  [{ provide: TaskServiceBase, useClass: TaskService }]
})
export class VerticalListComponent implements OnInit {
  @ViewChild('triggerRefresh') triggerRefresh: ElementRef;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  // data
  tasks: Observable<ITask[]>;
  taskLists: Observable<ITaskList[]>;

  // form-related objects
  selectedTaskList: string;
  openingStatement: string;
  quadrantForm: FormGroup;

  // sub-menu objects
  objectKeys = Object.keys;
  menuActionTask = [
    'Focus: Urgent & Important', 'Plan: Important but Not Urgent', 'Delegate: Urgent but Not Important', 'Eliminate: Not urgent & Not Important', 'Unspecified: Not Sure'
  ];
  /* TODO: Nested menus for different action types
  menuActionTask = {
    'Assign Quadrant': ['Focus: Urgent & Important', 'Plan: Important but Not Urgent', 'Delegate: Urgent but Not Important', 'Eliminate: Not urgent & Not Important'],
    'Create Reminder': ['Today AM', 'Today Afternoon', 'Today Evening'],
  };*/

  constructor(private taskService: TaskServiceBase, 
              private taskModifierService: TaskModifierServiceBase, 
              private formBuilder: FormBuilder, 
              private dragulaService: DragulaService, 
              private frameComponent: UserFrameComponent) {

    // initialize form
    this.createForm();
    this.openingStatement = "Sign in!  Then choose here!";
  }

  createForm() {
    this.quadrantForm = this.formBuilder.group({
      taskList: ''
    });
  }

  ngOnInit() {
    // wire up data event
    var sub = this.frameComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.taskModifierService.taskQuadrantUpdated.subscribe(item => this.onTaskQuadrantUpdated());
    this.subscriptions.push(sub); // capture for destruction

  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngDoCheck() {
  }

  // fired upon task list selection
  onChangeTaskList($event) {
    // load the new task list
    var taskListId: string = this.quadrantForm.get('taskList').value;
    console.log("Changing to a different list: " + taskListId);
    this.selectedTaskList = taskListId;
    this.loadTasks(taskListId);
  }

  // Fired from app component after user is authorized
  private onDataReadyToLoad(): void {
    this.getTaskLists();
  }

  // let's fetch the task lists
  getTaskLists() {
    var subscriber: Function;
    subscriber = (taskLists => this.onTaskListInitialSelection(taskLists));

    // TODO: error handling
    this.taskLists = this.taskService.getTaskLists(subscriber);
  }

  // Fired after initial task list is loaded
  onTaskListInitialSelection(taskLists: ITaskList[]){
    // select first list
    if (taskLists.length == 0) {
      this.openingStatement = "No task lists found!";
    } else {
      this.openingStatement = "Choose a task list";
      this.quadrantForm.get('taskList').patchValue(taskLists[0].id);
    }

    // Trigger UI update to notify Angular of GAPI model
    // This is preferable to polling (polling from ngOnInit does work)
    // Method markForCheck() is not effective at this stage
    this.triggerRefresh.nativeElement.click();
  }

  // Triggered by triggerRefresh event
  onRefresh() {
    // TODO: Handle any necessary user dialog here
  }

  // let's get the tasks
  loadTasks(taskListId: string) {
    // TODO: error handling
    this.tasks = this.taskService.getTasks(taskListId)
      .pipe(finalize((() => { this.onTasksLoaded(); })));
  }

  // Fired after tasks are loaded up
  onTasksLoaded() {
    // TODO: Handle any necessary user dialog here
  }

  // Called by repeater to determine appropriate quadrant for each task
  quadrantMatch(task: ITask, quadrant:string): boolean {
    return this.taskModifierService.checkQuadrantMatch(task, quadrant);
  }

  selectTaskAction(selection: any, taskId: any) {
    var targetQuadrant: string = null;

    if (selection == 'Focus: Urgent & Important') {
      targetQuadrant = "1";
    }
    if (selection == 'Plan: Important but Not Urgent') {
      targetQuadrant = "2";
    }
    if (selection == 'Delegate: Urgent but Not Important') {
      targetQuadrant = "3";
    }
    if (selection == 'Eliminate: Not urgent & Not Important') {
      targetQuadrant = "4";
    }
    if (selection == 'Unspecified: Not Sure') {
      targetQuadrant = "0";
    }

    console.log("Requested move of element " + taskId + " (to " + targetQuadrant + ")");
    if (targetQuadrant != null) {
      this.taskModifierService.updateTaskQuadrant(this.taskService, taskId, this.selectedTaskList, targetQuadrant);
    }
  }

  onTaskQuadrantUpdated() {
    // TODO: Optimize reload to remove flicker
    // Update model with committed data
    console.log("SDFSDFSDFSDFFSDSFDSFDFDSxxxxxxxxxxxxxxxxx");
    this.loadTasks(this.selectedTaskList);
  }

}
