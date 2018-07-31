import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthServiceBase } from './services/auth-service-base';
import { ConfigService } from './services/config.service';

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
              private activatedRoute: ActivatedRoute,
              private router: Router) {
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

  currentView(): string {
    if (this.router.url.indexOf('quadrant') > 0) {
      return "Quad";
    }
    if (this.router.url.indexOf('vertical-list') > 0) {
      return "Vert";
    }
    return "";
  }

  switchView() {
    var currentView = this.currentView();
    if (currentView == "Quad") {
      // We're on quadrant, switch to vertical-list
      window.location.assign("/vertical-list");
    }
    if (currentView == "Vert") {
      // We're on quadrant, switch to vertical-list
      window.location.assign("/quadrant");
    }
  }
}