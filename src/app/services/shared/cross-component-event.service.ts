import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrossComponentEventService {
  @Output() configLoaded: EventEmitter<any> = new EventEmitter();
  @Output() dataReadyToLoad: EventEmitter<any> = new EventEmitter();
  @Output() requestTitleChange: EventEmitter<any> = new EventEmitter();
  @Output() requestHeaderMessageAppend: EventEmitter<any> = new EventEmitter();

  constructor() { }
  
  // Signal when config info is fully loaded
  public signalConfigLoaded() {
    this.configLoaded.emit();
  }

  // Signal after authentication has occured
  public signalDataReadyToLoad() {
    this.dataReadyToLoad.emit();
  }

  // Signal when title change is desired
  public signalTitleChange(value: string) {
    this.requestTitleChange.emit(value);
  }
  
  // Signal when critical user information needs to be relayed
  public signalHeaderMessageAppend(value: string) {
    this.requestHeaderMessageAppend.emit(value);
  }

}
