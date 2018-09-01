import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-controls',
  templateUrl: './view-controls.component.html',
  styleUrls: ['./view-controls.component.css']
})
export class ViewControlsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  currentView(): string {
    if (this.router.url.indexOf('quadrant') > 0) {
      return "Quad";
    }
    if (this.router.url.indexOf('vertical-list') > 0) {
      return "Vert";
    }
    return "";
  }

  switchView() {
    var currentView = this.currentView();
    if (currentView == "Quad") {
      // We're on quadrant, switch to vertical-list
      this.router.navigateByUrl("/vertical-list");
    } else {
      // We're on quadrant, switch to vertical-list
      this.router.navigateByUrl("/quadrant");
    }
  }
}
