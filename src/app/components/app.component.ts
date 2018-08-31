import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'TaskAssist';

  constructor(private titleService: Title) {  }
  
  ngOnInit() {
    this.titleService.setTitle( this.title );
  }
}