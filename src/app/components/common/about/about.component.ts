import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserFrameComponent } from '../content-frame/content-frame.component';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_ABOUT } from '../../../user-messages';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  constructor(private frameComponent: UserFrameComponent,
              private crossComponentEventService: CrossComponentEventService) { }

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    // wire up data event
    var sub = this.crossComponentEventService.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    this.subscriptions.push(sub); // capture for destruction

    this.crossComponentEventService.signalTitleChange(MSG_TITLE_ABOUT);
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  // Fired from app component after user is authorized
  private onDataReadyToLoad(): void {
    // nothing to load at the moment
  }
  
}
