import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, PartialObserver } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

import { TaskService } from '../task.service';
import { ITask, ITaskList, TaskList, RootTask }       from '../data-model';

import { DragulaService } from 'ng2-dragula';


@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[TaskService], [DragulaService]]
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

  constructor(private formBuilder: FormBuilder, private taskService: TaskService, private dragulaService: DragulaService, private appComponent: AppComponent) {
    this.createForm();
    this.openingStatement = "Choose a task list here after you've logged in!";
  
    // init task service
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
      this.openingStatement = "Please create a Google task list first, and then refresh this page!";
    } else {
      this.openingStatement = "Choose a task list";
      this.quadrantForm.get('taskList').patchValue(taskLists[0].id);
    }

    // Current method uses div element to force UI load.
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
    if (task == null || task.notes == null) {
      return quadrant == null;
    } else {
      if (quadrant == null) {
        return !task.notes.includes("[Quad:");
      } else {
        return task.notes.includes("[Quad:" + quadrant + "]");
      }
    }
  }
}
