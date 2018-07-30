import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AuthServiceBase } from './services/auth-service-base';
import { ConfigService } from './services/config.service';
import { ConfigResolver } from './resolvers/config-resolver.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('googleLogin') googleLogin: ElementRef;
  @ViewChild('triggerRenderButton') triggerRenderButton: ElementRef;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  public title = "Drag or Tap Your Tasks";

  constructor(private authService: AuthServiceBase,
              private configService: ConfigService,
              private route: ActivatedRoute,
              private configResolver: ConfigResolver) {
  }

  ngOnInit() {
    // track key auth event
    var sub = this.configService.configResolved.subscribe(item => this.onConfigResolved());
    this.subscriptions.push(sub); // capture for destruction
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngAfterViewInit(): void {
  }

  // Fired when config is loaded, including required meta keys
  onConfigResolved() {
    // Activate Google OAuth2 login control
    this.triggerRenderButton.nativeElement.click();    
  }
  
  isSignedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}