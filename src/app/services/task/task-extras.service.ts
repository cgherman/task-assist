import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskExtrasService {

  constructor(private http: HttpClient) { }

  public List(taskListId: string): Observable<any> {
    console.log("LIST");
    let linkTaskList = "https://x.azurewebsites.net/api/task-lists/" + taskListId + "/task-extras";
    console.log("LIST:" + linkTaskList);
    return this.http.get(linkTaskList);
  }

  public Get(taskListId: string, id: string): Observable<any> {
    return this.dummyResponse();

    let linkTask = "https://x.azurewebsites.net/api/task-lists/" + taskListId + "/task-extras/" + id;
    console.log("GET:" + linkTask);
    return this.http.get(linkTask);
  }

  public Upsert(taskListId: string, id: string, body: any): Observable<any> {
    let linkTask = "https://x.azurewebsites.net/api/task-lists/" + taskListId + "/task-extras/" + id;
    console.log("UPSERT:" + linkTask);
    return this.http.put(linkTask, "");
  }

  private dummyResponse(): Observable<any> {
    let text = '{"taskOriginId":"TESTY-task","rank":2,"taskList":{"taskListOriginId":"TESTY-list","task":[]}}'
    let p = new Promise(resolve => {
      resolve(text);
    });
    return from(p);
  }
}
