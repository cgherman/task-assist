import { Output, EventEmitter, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http'; 
import { Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnDestroy {
  @Output() configResolved: EventEmitter<any> = new EventEmitter();

  private _discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
  private _scope = "https://www.googleapis.com/auth/tasks";

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  public get discoveryDocs(): string[] {
    return this._discoveryDocs;
  }

  get scope(): string{
    return this._scope;
  }

  constructor(private http: HttpClient) {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  // Method to fetch app-specific JSON file for Google API config
  // Create a project & API credentials here: https://console.developers.google.com/apis/credentials
  // File api_key.json contains two elements: api_key & client_id
  public getApiKeys(): Observable<Object> {
    return this.getJson("/assets/api_key.json");
  } 

  private getJson(filename: string): Observable<Object> {
    return this.http.get(filename);
  }

  // Used to communicate between controls (namely Google OAuth2 button)
  // Invoked when config values are loaded as necessary into DOM
  configIsResolved() {
    this.configResolved.emit();
  }

  apiKeyFromConfig(config: any) {
    return config.api_key;
  }

  clientIdFromConfig(config: any) {
    return config.client_id;
  }

}
