import { Injectable } from '@angular/core';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GapiWrapperService {

  private _gapiReference = null;

  constructor() { }
  
    // Set reference to Google API
    get instance(): any {
      return gapi;
    }    
}
