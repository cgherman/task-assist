import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
  @ViewChild('triggerRefresh') triggerRefresh: ElementRef;

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

  private onDataLoaded() {
    // Trigger UI update to notify Angular of GAPI model
    // This is preferable to polling GAPI (polling from ngOnInit does work)
    // Method markForCheck() is not effective at this stage
    this.triggerRefresh.nativeElement.click();
  }

  // Triggered by triggerRefresh event
  onRefresh() {
    // TODO: Handle any necessary user dialog here
  }
  
}
