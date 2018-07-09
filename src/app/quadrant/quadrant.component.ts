import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

import { TaskService } from '../task.service';
import { ITask, ITaskList, TaskList }       from '../data-model';

import { DragulaService } from 'ng2-dragula';


@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[TaskService], [DragulaService]]
})

export class QuadrantComponent implements OnInit {
  tasks: Observable<ITask[]>;
  taskLists: Observable<ITaskList[]>;
  selectedTaskList: string;

  quadrantForm = new FormGroup ({
    taskList: new FormControl()
  });

  constructor(private fb: FormBuilder, private taskService: TaskService, private dragulaService: DragulaService, private appComponent: AppComponent) {
 
    this.createForm();

    // init task service
    appComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    
    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
  }

  ngOnInit() {
  }

  createForm() {
    this.quadrantForm = this.fb.group({
      taskList: this.selectedTaskList
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

    // TODO: current method uses window handle to force UI load
    window['triggerRefresh'].click();
  }

  getTaskLists() {
    // TODO: error handling
    this.taskLists = this.taskService.getTaskLists()
      .pipe(finalize((() => { this.onTaskListsLoaded(); })));
    
    // TODO: execution order not guaranteed, above call may finish early
    this.taskLists.subscribe(value => this.onTaskListInitialSelection(value));
  }

  onTaskListsLoaded() {
    // select first list by default
  }

  onTaskListInitialSelection(value: ITaskList[]){
    // select first list
    this.quadrantForm.get('taskList').setValue(value[0].id);
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
