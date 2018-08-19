import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrossComponentEventService {
  @Output() configResolved: EventEmitter<any> = new EventEmitter();
  @Output() backgroundGoogleTasksDone: EventEmitter<any> = new EventEmitter();
  @Output() requestTitleChange: EventEmitter<any> = new EventEmitter();
  @Output() requestHeaderMessageAppend: EventEmitter<any> = new EventEmitter();
  @Output() dataReadyToLoad: EventEmitter<any> = new EventEmitter();

  constructor() { }

    // Signal when config is fully loaded
    public signalConfigResolved() {
      this.configResolved.emit();
    }
  
    // Signal when xxxxxxxxxxxxxxxxx
    public signalBackgroundGoogleTasksDone() {
      this.backgroundGoogleTasksDone.emit();
    }

    // Signal when title change is desired
    public signalTitleChange(value: string) {
      this.requestTitleChange.emit(value);
    }

    // Signal when critical user information needs to be relayed
    public signalHeaderMessageAppend(value: string) {
      this.requestHeaderMessageAppend.emit(value);
    }

    // Signal when xxxxxxxxxxxxxxxxx
    public signalDataReadyToLoad() {
      this.dataReadyToLoad.emit();
    }
}
