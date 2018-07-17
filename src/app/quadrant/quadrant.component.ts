import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

import { TaskModifierServiceBase } from '../task-modifier-service-base';
import { TaskServiceBase } from '../task-service-base';
import { TaskService } from '../task.service';
import { ITaskList } from '../models/itask-list';
import { ITask } from '../models/itask';

import { DragulaService } from 'ng2-dragula';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[DragulaService],
               { provide: TaskServiceBase, useClass: TaskService }]
})
  
export class QuadrantComponent implements OnInit, OnDestroy {
  @ViewChild('triggerRefresh') triggerRefresh: ElementRef;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  // Dragula options
  dragulaOptions: any = {
    revertOnSpill: true,
    removeOnSpill: false,
    copy: false,
    ignoreInputTextSelection: true
  }

  // data
  tasks: Observable<ITask[]>;
  taskLists: Observable<ITaskList[]>;

  // form-related objects
  selectedTaskList: string;
  openingStatement: string;
  quadrantForm: FormGroup;

  constructor(private taskService: TaskServiceBase, 
              private taskModifierServiceBase: TaskModifierServiceBase, 
              private formBuilder: FormBuilder, 
              private dragulaService: DragulaService, 
              private appComponent: AppComponent) {

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
    // Init Dragula drag-n-drop
    var sub = this.dragulaService.drop.subscribe(args => this.onDrop(args));
    this.subscriptions.push(sub); // capture for destruction

    // wire up data event
    var sub = this.appComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
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

  onDrop(args) {
    let [bagName, element, target, source] = args;
    var quadrantOld = source.id.substring(target.id.length - 1)
    var quadrantNew = target.id.substring(target.id.length - 1)

    console.log("Element " + element.id + " moved (" + quadrantOld + "->" + quadrantNew + ")");

    // Get Dragula "drake" API reference (ng2-dragula doc refers to dragula)
    // https://github.com/bevacqua/dragula#readme
    var drake = this.dragulaService.find('taskBag').drake;

    // Undo the Dragula div update to prevent rendering errors
    drake.cancel(true);

    // Write update to API and refresh data model
    this.updateTask(element.id, quadrantNew, drake);
  }

  private updateTask(taskId: string, targetQuadrant: string, dragulaDrake: any){
    // get fresh task to work upon
    this.taskService.getTask(taskId, this.selectedTaskList)
    .pipe(take(1))
    .subscribe((task: ITask) => 
      {
        // Update notes of fresh task
        this.taskModifierServiceBase.setQuadrant(task, targetQuadrant);

        // Commit updated task notes via Google API
        this.taskService.updateTask( task, this.selectedTaskList
        ).then((task) => {
          console.log("Task " + task.id + " successfully updated via API.");

          // TODO: Optimize reload to remove flicker
          // Update model with committed data
          this.loadTasks(this.selectedTaskList);

        }).catch((errorHandler) => {
          console.log('Error in QuadrantComponent.onDrop: UpdateTask: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
        });
      }
    );
  }

  // Called by repeater to determine appropriate quadrant for each task
  quadrantMatch(task: ITask, quadrant:string): boolean {
    return this.taskModifierServiceBase.checkQuadrantMatch(task, quadrant);
  }
}
