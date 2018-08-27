import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { MSG_MISSING_CONFIG,MSG_MISSING_API_KEY, MSG_MISSING_CLIENT_KEY } from '../../user-messages';
import { ConfigResolverHandlerService } from './config-resolver-handler.service';
import { GoogleAuthServiceBase } from '../auth/google-auth-service-base';
import { ConfigEventContainer } from '../../models/config/config-event-container';

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class ConfigAppService implements OnDestroy {
  public configError: Subject<string> = new Subject();
  public configLoaded: Subject<any> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private route: ActivatedRoute;
  private authService: GoogleAuthServiceBase;

  constructor(private configResolverHandlerService: ConfigResolverHandlerService,
              private meta: Meta
            ) {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  public init(route: ActivatedRoute, authService: GoogleAuthServiceBase) {
    this.route = route;
    this.authService = authService;

    var sub = this.configResolverHandlerService.configResolved.subscribe(item => this.onConfigResolved(item));
    this.subscriptions.push(sub); // capture for destruction

    this.configResolverHandlerService.init(this.route);    
  }
  
  // Fired when config-resolver is handled
  private onConfigResolved(configEventContainer: ConfigEventContainer) {
    this.verifyConfig(configEventContainer);
    this.loadConfig(configEventContainer);
  }

  // Check for issues
  private verifyConfig(configEventContainer: ConfigEventContainer) {
    // If API keys have not been configured, then show a message
    if (configEventContainer.api_key == null || configEventContainer.client_id == null) {
      if (configEventContainer.api_key == null) {
        this.configError.next(MSG_MISSING_API_KEY);
      }

      if (configEventContainer.client_id == null) {
        this.configError.next(MSG_MISSING_CLIENT_KEY);
      }

      this.configError.next(MSG_MISSING_CONFIG);
    }
  }

  // Apply configuration
  private loadConfig(configEventContainer: ConfigEventContainer) {
    // set Google config to enable auth
    this.authService.scope = configEventContainer.scope;
    this.authService.discoveryDocs = configEventContainer.discoveryDocs;
    this.authService.api_key = configEventContainer.api_key;
    this.authService.client_id = configEventContainer.client_id;

    // insert meta tags for Google OAuth2
    this.meta.updateTag({ name: 'google-signin-scope', content: configEventContainer.scope });
    this.meta.updateTag({ name: 'google-signin-client_id', content: configEventContainer.client_id });

    // Config values are loaded; we can tell Google OAuth to go forth
    this.configLoaded.next(); 
  }
}