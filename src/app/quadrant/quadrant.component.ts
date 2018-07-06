import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';
import { ITask, ITaskList }       from '../data-model';
import { DragulaService } from 'ng2-dragula';
import { AppComponent } from '../app.component';
import { ITaskService } from '../itask-service';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[TaskService], [DragulaService], [AppComponent]]
})

export class QuadrantComponent implements OnInit {
  taskService: ITaskService;
  tasks: ITask[];
  taskLists: ITaskList[];
  quadrantForm = new FormGroup ({
    taskList: new FormControl()
  });

  constructor(taskService: TaskService, private dragulaService: DragulaService, private appComponent: AppComponent) {
    // init task service
    this.taskService = appComponent;
    appComponent.onDataLoad.subscribe(item => this.onDataLoad());

    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
    dragulaService.setOptions('taskBag', {
      invalid: () => false,
      revertOnSpill: true
    })
  }

  ngOnInit() {
    this.loadData();
  }

  onDataLoad(): void {
    this.loadData();
    location.reload();
  }

  private loadData(): void {
    // Get user's task lists
    this.taskLists = this.taskService.getTaskLists();
    this.tasks = this.taskService.getTasks();    
  }

  onDrop() {
    // TODO: Commit to Google API
  }

  quadrantMatch(task: ITask, quadrant:string): boolean {
    if (quadrant == null) {
      return !task.notes.includes("[Quad:");
    } else {
      return task.notes.includes("[Quad:" + quadrant + "]");
    }
  }

}
