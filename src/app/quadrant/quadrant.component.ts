import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, PartialObserver } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

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

  constructor(private taskService: TaskServiceBase, private formBuilder: FormBuilder, private dragulaService: DragulaService, private appComponent: AppComponent) {
    // initialize form
    this.createForm();
    this.openingStatement = "Sign in!  Then choose here!";
  
    // wire up event
    appComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    
    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
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
    var taskListId: string = this.quadrantForm.get('taskList').value;
    console.log("Changing to a different list: " + taskListId);
    this.selectedTaskList = taskListId;
    this.getTasks(taskListId);
  }

  private onDataReadyToLoad(): void {
    // We're now authorized, let's load up the data
    this.getTaskLists();
  }

  getTaskLists() {
    var subscriber = (taskLists => this.onTaskListInitialSelection(taskLists));

    // TODO: error handling
    this.taskLists = this.taskService.getTaskLists(subscriber);
  }

  onTaskListInitialSelection(taskLists: ITaskList[]){
    // select first list
    if (taskLists.length == 0) {
      this.openingStatement = "No task lists found!";
    } else {
      this.openingStatement = "Choose a task list";
      this.quadrantForm.get('taskList').patchValue(taskLists[0].id);
    }

    // Current method uses div element to force UI load.
    // TODO: Look into $scope.$digest so angular is aware of model changes from 3rd party
    this.triggerRefresh.nativeElement.click();
  }

  onRefresh() {
  }
    
  getTasks(taskListId: string) {
    // TODO: error handling
    this.tasks = this.taskService.getTasks(taskListId)
      .pipe(finalize((() => { this.onTasksLoaded(); })));
  }

  onTasksLoaded() {
  }

  onDrop() {
    // TODO: Commit quadrant change to Google API
  }

  quadrantMatch(task: ITask, quadrant:string): boolean {
    if (task.title == null || task.title.trim().length == 0) {
      // do not show "empty" tasks
      return false;
    }

    if (task == null || task.notes == null) {
      // declare match with "unspecified" quadrant
      return quadrant == null;
    } else {
      // match up specific quadrants
      if (quadrant == null) {
        return !task.notes.includes("[Quad:");
      } else {
        return task.notes.includes("[Quad:" + quadrant + "]");
      }
    }
  }
}
