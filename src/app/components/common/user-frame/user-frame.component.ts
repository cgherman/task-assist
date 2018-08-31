import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ConfigAppService } from '../../../services/config/config-app.service';
import { GoogleAuthServiceBase } from '../../../services/auth/google-auth-service-base';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-frame',
  templateUrl: './user-frame.component.html',
  styleUrls: ['./user-frame.component.css']
})
export class UserFrameComponent implements OnInit, OnDestroy {
  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,     
              private configAppService: ConfigAppService,
              private authService: GoogleAuthServiceBase,
              private crossComponentEventService: CrossComponentEventService
            ) {

  }

  ngOnInit() {
    var sub = this.configAppService.configError.subscribe(text => this.onConfigError(text));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.configAppService.configLoaded.subscribe(item => this.onConfigLoaded());
    this.subscriptions.push(sub); // capture for destruction

    this.configAppService.init(this.route, this.authService);
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  private onConfigError(text: string) {
    this.crossComponentEventService.signalWarningMessageAppend(text);
  }

  private onConfigLoaded() {
    this.crossComponentEventService.signalConfigLoaded();
  }
}
