import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ActivatedRoute } from '@angular/router';
import { ConfigEventContainer } from '../../models/config/config-event-container';

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class ConfigResolverHandlerService implements OnDestroy {
  @Output() configResolved: EventEmitter<any> = new EventEmitter();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private _discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
  private _scope = "https://www.googleapis.com/auth/tasks";

  constructor() {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  public handleResult() {
  }

  public init(route: ActivatedRoute): Subscription {
    var sub = route.data.subscribe((data: { config: any }) => {
      // extract config elements
      let api_key = this.apiKeyFromConfig(data.config);
      let client_id = this.clientIdFromConfig(data.config);
      this.onConfigResolved(api_key, client_id, this._discoveryDocs, this._scope);
    });
    this.subscriptions.push(sub); // capture for destruction

    return sub;
  }

  private onConfigResolved(api_key: string, client_id: string, discoveryDocs: string[], scope:string) {
    var configEventContainer = new ConfigEventContainer();
    configEventContainer.scope = scope;
    configEventContainer.discoveryDocs = discoveryDocs;
    configEventContainer.api_key = api_key;
    configEventContainer.client_id = client_id;
    this.configResolved.emit( configEventContainer );
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