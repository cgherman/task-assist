import { Injectable, OnDestroy } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription, Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    var result: Observable<Object>;

    result = this.configService.getApiKeys();

    return result.pipe(
      catchError( err => {
          if (err.status == 404) {
            // Config file was not found
            return EMPTY;
          } else {
            return throwError(err);
          }
      })
    );
  }
}