import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable()
export class ConfigResolver implements Resolve<Object> {

  constructor(private configService: ConfigService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    return this.configService.getApiKeys();
  }
}