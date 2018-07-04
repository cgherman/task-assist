import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css']
})

export class QuadrantComponent implements OnInit {
  quadrantForm = new FormGroup ({
    title: new FormControl()
  });

  constructor() { }

  ngOnInit() {
  }
}
