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
  selectedTaskList: TaskList;

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
      taskList: null
    });
  }

  // upon task list selection
  onChangeTaskList($event) {
    var formValues = this.quadrantForm.get('taskList').value;
    console.log("Changing to a different list: " + formValues);
    //.set('some value');
    this.getTasks(formValues);
  }

  p/* rivate onDataReadyToLoad(): void {
    // We're now authorized, let's load up the data
    this.getTaskLists().then((response) => {
    }).then((response) => {
      // Select first task list
      var taskList = this.taskLists[0];
      console.log(this.quadrantForm.get('taskList'));

      // TODO: This hould ultimately not be necessary if change event is working
      // Force load first task list
      this.loadTasks(taskList.id);
    }).catch((errorHandler) => {
      console.log('Error in QuadrantComponent.onDataReadyToLoad: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  } */

  private onDataReadyToLoad(): void {
    this.getTaskLists();
  }

  getTaskLists() {
    // TODO: error handling
    this.taskLists = this.taskService.getTaskLists()
      .pipe(finalize((() => { this.onTaskListsLoaded(); })));
  }

  onTaskListsLoaded() {
    //getTasks();

    //this.isLoading = false
  }


 /*  private loadData(): Promise<any> {
    return this.taskService.getTaskLists(
    ).then((response) => {
      // Load task lists
      this.taskLists = response;
    }).catch((errorHandler) => {
      console.log('Error in QuadrantComponent.loadData: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  } */

  getTasks(taskListId: string) {
    // TODO: error handling
    this.tasks = this.taskService.getTasks(taskListId)
      .pipe(finalize((() => { this.onTasksLoaded(); })));
  }

  onTasksLoaded() {

  }

/*   private loadTasks(taskListId: string) {
    console.log("Loading task list into UI: " + taskListId);
    this.taskService.getTasks({ taskListId: taskListId
    }).then((response) => {
      // Capture tasks
      this.tasks = response;

      // TODO: Implement this correctly using proper binding
      // Touch the dropdown control to force UI update
      window['taskListDropDown'].innerHTML=window['taskListDropDown'].innerHTML;
    }).catch((errorHandler) => {
      console.log('Error in QuadrantComponent.loadTasks: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  } */

  onDrop() {
    // TODO: Commit to Google API
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
