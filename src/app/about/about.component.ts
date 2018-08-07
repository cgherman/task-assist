import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserFrameComponent } from '../user-frame/user-frame.component';
import { Subscription } from 'rxjs';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  constructor(private frameComponent: UserFrameComponent) { }

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    // wire up data event
    var sub = this.frameComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    this.subscriptions.push(sub); // capture for destruction

    this.frameComponent.title = "About TaskAssist";
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  // Fired from app component after user is authorized
  private onDataReadyToLoad(): void {
    // nothing to load, continue
    this.onDataLoaded();
  }

  protected onDataLoaded() {
    this.frameComponent.backgroundGoogleTasksDone();
  }
  
}
