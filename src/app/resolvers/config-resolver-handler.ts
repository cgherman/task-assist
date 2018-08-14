import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ActivatedRoute } from '@angular/router';

@AutoUnsubscribe({includeArrays: true})
@Injectable()
export class ConfigResolverHandler implements OnDestroy {
  @Output() configResolved: EventEmitter<any> = new EventEmitter();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];
  private data;

  constructor() {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  public handleResult() {
  }

  public configure(route: ActivatedRoute): Subscription {
    var sub = route.data.subscribe((data: { config: any }) => {
      // extract config elements
      let api_key = this.apiKeyFromConfig(data.config);
      let client_id = this.clientIdFromConfig(data.config);
      this.onConfigResolved(api_key, client_id);
    });
    this.subscriptions.push(sub); // capture for destruction

    return sub;
  }

  private onConfigResolved(api_key: string, client_id: string) {
    this.configResolved.emit( {api_key, client_id} );
  }

  private apiKeyFromConfig(config: any) {
    if (config == null) {
      return null;
    } else {
      return config.api_key;
    }
  }

  private clientIdFromConfig(config: any) {
    if (config == null) {
      return null;
    } else {
      return config.client_id;
    }
  }

}