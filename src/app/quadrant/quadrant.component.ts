import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';
import { ITask, ITaskList }       from '../data-model';
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

  constructor(private taskService: TaskService, private dragulaService: DragulaService, private appComponent: AppComponent) {
    // init task service
    appComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    
    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
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

      // TODO: Load selected task list
      // Load first task list
      var taskList = this.taskLists[0];
      this.taskService.getTasks({ taskList: taskList
      }).then((response) => {
        // Capture tasks
        this.tasks = response;
      }).catch((errorHandler) => {
        console.log('Error in QuadrantComponent.loadData: getTasks: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
      });  
    }).catch((errorHandler) => {
      console.log('Error in QuadrantComponent.loadData: getTaskLists: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
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
