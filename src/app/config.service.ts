import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  constructor(private http: HttpClient) {
  }

  // Method to fetch app-specific JSON file for Google API config
  // Create a project & API credentials here: https://console.developers.google.com/apis/credentials
  // File api_key.json contains two elements: api_key & client_id
  public getApiKeys(): Observable<any> {
    return this.getJson("/assets/api_key.json");
  }

  private getJson(filename: string): Observable<any> {
    return this.http.get(filename)
  }
}
