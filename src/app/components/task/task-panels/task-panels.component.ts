import { Component, OnInit } from '@angular/core';
import { ITask } from '../../../models/task/itask';
import { ActivatedRoute } from '@angular/router';
import { FlatTask } from '../../../models/task/flat-task';

@Component({
  selector: 'app-task-panels',
  templateUrl: './task-panels.component.html',
  styleUrls: ['./task-panels.component.css']
})
export class TaskPanelsComponent implements OnInit {
  private taskId: string;
  private selectedTask: ITask;

    // TO DO: Replace with actual model
    tasks = [1,2,3,4,5];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];

    // TO DO: Replace with actual object from model
    if (this.taskId != null && this.taskId.length > 0) {
      this.selectedTask = new FlatTask();
      this.selectedTask.id = this.taskId;
    }
  }

  onChildClick(item) {
    console.log(item);
  }
}
