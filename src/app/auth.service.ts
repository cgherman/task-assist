import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  //TODO: Put config files in private JSON object to avoid checking in to Git
  static client_id = "782561556087-8vrgbd6393gagmenk100qmv4lfbpulrg.apps.googleusercontent.com";
  static scope = "https://www.googleapis.com/auth/tasks";
  static discoveryDocs = "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest";
  static api_key = "AIzaSyBke1n7BqFee0XcM7_WbIg337YsPrROgh0";

  constructor() {
  }

  //static GetGapi(): any {
  //  let gapi = window["gapi"];
  //}


}
