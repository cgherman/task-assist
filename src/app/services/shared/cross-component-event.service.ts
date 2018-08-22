import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrossComponentEventService {
  public configLoaded: Subject<any> = new Subject();
  public dataReadyToLoad: Subject<any> = new Subject();
  public requestTitleChange: Subject<string> = new Subject();
  public requestHeaderMessageAppend: Subject<string> = new Subject();

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
  public signalHeaderMessageAppend(value: string) {
    this.requestHeaderMessageAppend.next(value);
  }

}
