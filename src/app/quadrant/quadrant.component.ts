import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';
import { ITask, ITaskList, TaskList }       from '../data-model';
import { DragulaService } from 'ng2-dragula';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[TaskService], [DragulaService]]
})

export class QuadrantComponent implements OnInit {
  tasks: ITask[];
  taskLists: ITaskList[];
  quadrantForm = new FormGroup ({
    taskList: new FormControl()
  });

  constructor(private fb: FormBuilder, private zone: NgZone, private taskService: TaskService, private dragulaService: DragulaService, private appComponent: AppComponent) {
 
    this.createForm();

    // init task service
    appComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    
    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
  }

  createForm() {
    this.quadrantForm = this.fb.group({
      taskList: ''//this.fb.group(new TaskList("test","test")), // <--- the FormControl called "name"
    });
  }

  ngOnInit() {
  }

  private onDataReadyToLoad(): void {
    this.loadData();
  }

  private loadData(): void {
    this.taskService.getTaskLists(
    ).then((response) => {
      
      // Load task lists
      this.taskLists = response;

      // Load first task list
      var taskList = this.taskLists[0];
      this.loadTasks(taskList);
    }).catch((errorHandler) => {
      console.log('Error in QuadrantComponent.loadData: getTaskLists: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  }

  private loadTasks(taskList:any) {
    console.log(taskList);
    this.taskService.getTasks({ taskList: taskList
    }).then((response) => {
      // Capture tasks
      this.tasks = response;

      // TODO: Implement this correctly using proper binding
      // Touch the dropdown control to force UI update
      window['taskListDropDown'].innerHTML=window['taskListDropDown'].innerHTML;
    }).catch((errorHandler) => {
      console.log('Error in QuadrantComponent.loadData: getTasks: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

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
