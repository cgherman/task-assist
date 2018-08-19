import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppEventsService {
  @Output() configResolved: EventEmitter<any> = new EventEmitter();
  @Output() backgroundGoogleTasksDone: EventEmitter<any> = new EventEmitter();
  @Output() requestTitleChange: EventEmitter<any> = new EventEmitter();
  @Output() requestHeaderMessageAppend: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

    // Fired when config is loaded, including required meta keys
    public fireConfigResolved() {
      this.configResolved.emit();
    }
  
    public fireBackgroundGoogleTasksDone() {
      this.backgroundGoogleTasksDone.emit();
    }
}
