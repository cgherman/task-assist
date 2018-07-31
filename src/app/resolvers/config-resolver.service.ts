import { Injectable, OnDestroy } from '@angular/core';
import { Router, Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription, Observable, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ConfigService } from '../services/config.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Injectable()
export class ConfigResolver implements Resolve<Object>, OnDestroy {

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private configService: ConfigService, private router: Router) {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    return this.configService.getApiKeys();
  }
}