import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrossComponentEventService {
  public configLoaded: Subject<any> = new Subject();
  public dataReadyToLoad: Subject<any> = new Subject();
  public requestTitleChange: Subject<string> = new Subject();
  public requestWarningMessageAppend: Subject<string> = new Subject();
  public requestWarningMessageClear: Subject<any> = new Subject();

  constructor() { }
  
  // Signal when config info is fully loaded
  public signalConfigLoaded() {
    this.configLoaded.next();
  }

  // Signal after authentication has occured
  public signalDataReadyToLoad() {
    this.dataReadyToLoad.next();
  }

  // Signal when title change is desired
  public signalTitleChange(value: string) {
    this.requestTitleChange.next(value);
  }
  
  // Signal when critical user information needs to be relayed
  public signalWarningMessageAppend(value: string) {
    this.requestWarningMessageAppend.next(value);
  }

  // Signal that critical user information can be cleared
  public signalWarningMessageClear() {
    this.requestWarningMessageClear.next();
  }
}
