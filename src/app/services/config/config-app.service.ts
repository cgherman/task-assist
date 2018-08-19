import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ActivatedRoute } from '@angular/router';
import { ConfigResolverHandlerService } from './config-resolver-handler.service';
import { MSG_MISSING_CONFIG,MSG_MISSING_API_KEY, MSG_MISSING_CLIENT_KEY } from '../../user-messages';
import { CrossComponentEventService } from '../shared/cross-component-event.service';
import { GoogleAuthServiceBase } from '../auth/google-auth-service-base';
import { Meta } from '@angular/platform-browser';

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class ConfigAppService implements OnDestroy {

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private configResolverHandlerService: ConfigResolverHandlerService,
              private meta: Meta, 
              private appEventsService: CrossComponentEventService,
              private authService: GoogleAuthServiceBase) {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  public init(route: ActivatedRoute) {
    var sub = this.configResolverHandlerService.configResolved.subscribe(item => this.onConfigResolved(item));
    this.configResolverHandlerService.init(route);
    this.subscriptions.push(sub); // capture for destruction
  }
  
  // Fired when config-resolver is handled
  private onConfigResolved($event) {
    // fetch config elements from config
    let scope = $event.scope;
    let discoveryDocs = $event.discoveryDocs;
    let api_key = $event.api_key;
    let client_id = $event.client_id;

    // If API keys have not been configured, then show a message
    if (api_key == null || client_id == null) {
      if (api_key == null) {
        this.requestHeaderMessageAppend(MSG_MISSING_API_KEY);
      }

      if (client_id == null) {
        this.requestHeaderMessageAppend(MSG_MISSING_CLIENT_KEY);
      }

      this.requestHeaderMessageAppend(MSG_MISSING_CONFIG);
    }

    // set Google config to enable auth
    this.authService.scope = scope;
    this.authService.discoveryDocs = discoveryDocs;
    this.authService.api_key = api_key;
    this.authService.client_id = client_id;

    // insert meta tags for Google OAuth2
    this.meta.updateTag({ name: 'google-signin-scope', content: scope });
    this.meta.updateTag({ name: 'google-signin-client_id', content: client_id });

    // Config values are loaded; we can tell Google OAuth to go forth
     this.appEventsService.fireConfigResolved();    
  }

  private requestHeaderMessageAppend(value: string) {
    this.appEventsService.requestHeaderMessageAppend.emit(value);
  }  
}