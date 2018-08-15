import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient  } from '@angular/common/http'; 
import { Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class FileFetchService implements OnDestroy {

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

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
}
