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
  
  googleTaskService: AppComponent;
  tasks: ITask[];
  taskLists: ITaskList[];
  quadrantForm = new FormGroup ({
    taskList: new FormControl()
  });

  constructor(private taskService: TaskService, private dragulaService: DragulaService ) {

    // Init drag-n-drop
    dragulaService.drop.subscribe(value => this.onDrop());
    dragulaService.setOptions('bagName', {
      invalid: () => false,
      revertOnSpill: true
    })
  }

  ngOnInit() {
  }

  populateModels(taskLists: ITaskList[]) {
    var index: number;

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
