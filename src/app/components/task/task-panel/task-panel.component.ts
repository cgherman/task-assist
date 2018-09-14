import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-panel',
  templateUrl: './task-panel.component.html',
  styleUrls: ['./task-panel.component.css']
})
export class TaskPanelComponent implements OnInit {
  @Input() task: any;
  @Output() childClick = new EventEmitter<any>();
  
  myform: FormGroup; 
  date = new FormControl();

  constructor() { }

  ngOnInit() {
    this.myform = new FormGroup({
      stuff: new FormControl(),
      date: this.date,
    });
  }

  onGet() {
  }

  onSet() {
  }

  emitSomething() {
    this.childClick.emit(this);
  }
}
