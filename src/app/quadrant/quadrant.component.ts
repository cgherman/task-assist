import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';
import { TaskList }       from '../data-model';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
  providers:  [TaskService]
})

export class QuadrantComponent implements OnInit {
  taskLists: TaskList[];
  quadrantForm = new FormGroup ({
    title: new FormControl()
  });

  taskService = new TaskService();

  constructor(service: TaskService) {
    this.taskLists = service.getTaskLists();
  }

  ngOnInit() {
  }
}