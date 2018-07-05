import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';
import { ITask, ITaskList }       from '../data-model';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[TaskService], [DragulaService]]
})

export class QuadrantComponent implements OnInit {
  taskService: TaskService;
  tasks: ITask[];
  taskLists: ITaskList[];
  quadrantForm = new FormGroup ({
    taskList: new FormControl()
  });

  constructor(taskService: TaskService, private dragulaService: DragulaService) {
    // init task service
    this.taskService = taskService;

    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
    dragulaService.setOptions('bagName', {
      invalid: () => false,
      revertOnSpill: true
    })
  }

  ngOnInit() {
    // Get user's task lists
    this.taskLists = this.taskService.getTaskLists();
    this.tasks = this.taskService.getTasks();
  }

 onDrop() {
    // do something
  }

  quadrantMatch(task: ITask, quadrant:string): boolean {
    if (quadrant == null) {
      return !task.notes.includes("[Quad:");
    } else {
      return task.notes.includes("[Quad:" + quadrant + "]");
    }
  }
}
