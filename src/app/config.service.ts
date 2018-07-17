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
  // Create a new project & corresponding credentials here: https://console.developers.google.com/apis/credentials
  public getApiKeys(): Observable<any> {
    return this.getJson("./assets/api_key.json");
  }

  private getJson(filename: string): Observable<any> {
    return this.http.get(filename)
  }
}
