import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, PartialObserver } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

import { TaskModifierServiceBase } from '../task-modifier-service-base';
import { TaskServiceBase } from '../task-service-base';
import { TaskService } from '../task.service';
import { ITaskList } from '../models/itask-list';
import { ITask } from '../models/itask';

import { DragulaService } from 'ng2-dragula';


@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[DragulaService],
               { provide: TaskServiceBase, useClass: TaskService }]
})

export class QuadrantComponent implements OnInit {
  @ViewChild('triggerRefresh') triggerRefresh: ElementRef;

  tasks: Observable<ITask[]>;
  taskLists: Observable<ITaskList[]>;

  selectedTaskList: string;
  openingStatement: string;

  quadrantForm = new FormGroup ({
    taskList: new FormControl()
  });

  constructor(private taskService: TaskServiceBase, private taskModifierServiceBase: TaskModifierServiceBase, private formBuilder: FormBuilder, private dragulaService: DragulaService, private appComponent: AppComponent) {
    // initialize form
    this.createForm();
    this.openingStatement = "Sign in!  Then choose here!";
  
    // wire up event
    appComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    
    // Init drag-n-drop
    dragulaService.drop.subscribe(args => this.onDrop(args));
  }

  ngOnInit() {
  }

  createForm() {
    this.quadrantForm = this.formBuilder.group({
      taskList: ''
    });
  }

  // fired upon task list selection
  onChangeTaskList($event) {
    // TODO: Ensure divs are cleared/updated upon list change
    
    // load the new task list
    var taskListId: string = this.quadrantForm.get('taskList').value;
    console.log("Changing to a different list: " + taskListId);
    this.selectedTaskList = taskListId;
    this.getTasks(taskListId);
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

    // Current method uses div element to force UI load.
    // TODO: Use native refresh calls
    //       Look into $scope.$digest
    //       Angular must be made aware of model changes from 3rd party.
    this.triggerRefresh.nativeElement.click();
  }

  // Triggered by triggerRefresh click event
  onRefresh() {
    // TODO: See triggerRefresh click event
  }

  // let's get the tasks
  getTasks(taskListId: string) {
    // TODO: error handling
    this.tasks = this.taskService.getTasks(taskListId)
      .pipe(finalize((() => { this.onTasksLoaded(); })));
  }

  // Fired after tasks are loaded up
  onTasksLoaded() {
    // TODO: Handle any necessary log-in dialog here
  }

  onDrop(args) {
    // Update data model
    let [bagName, element, target, source] = args;

    var QuadrantOld = source.id.substring(target.id.length - 1)
    var QuadrantNew = target.id.substring(target.id.length - 1)

    console.log("Element " + element.id + " moved (" + QuadrantOld + "->" + QuadrantNew + ")");

    this.taskService.getTask(element.id).pipe(take(1)).subscribe(
      (task: ITask) => {
        // modify notes of fresh task
        this.taskModifierServiceBase.setQuadrant(task, QuadrantNew);

        // Update task notes via Google API
        this.taskService.updateTask( task
        ).then((task) => {
          console.log("Task " + task.id + " successfully updated via API.");
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
