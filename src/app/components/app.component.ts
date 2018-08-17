import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @Output() configResolved: EventEmitter<any> = new EventEmitter();
  @Output() backgroundGoogleTasksDone: EventEmitter<any> = new EventEmitter();
  @Output() requestTitleChange: EventEmitter<any> = new EventEmitter();
  @Output() requestHeaderMessageAppend: EventEmitter<any> = new EventEmitter();

  public set title(value: string) {
    this.requestTitleChange.emit(value);
  }

  constructor() {
  }

  // Fired when config is loaded, including required meta keys
  public bubbledConfigResolved() {
    this.configResolved.emit();
  }

  public bubbledBackgroundGoogleTasksDone() {
    this.backgroundGoogleTasksDone.emit();
  }

  public headerMessageAppend(value: string) {
    this.requestHeaderMessageAppend.emit(value);
  }
  
  ngOnInit() {
  }
}