import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';
import { TaskList }       from '../data-model';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [[TaskService], [DragulaService]]
})

export class QuadrantComponent implements OnInit {
  taskLists: TaskList[];
  quadrantForm = new FormGroup ({
    title: new FormControl()
  });

  taskService = new TaskService();

  constructor(service: TaskService, private dragulaService: DragulaService) {
    this.taskLists = service.getTaskLists();
    dragulaService.drop.subscribe(value => this.onDrop());
    dragulaService.setOptions('bagName', {
      invalid: () => false,
      revertOnSpill: true
    })
  }

  ngOnInit() {
  }

 onDrop() {
    // do something
  }

}
