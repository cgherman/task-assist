import { Injectable }       from '@angular/core';
import { ITaskList, TaskList, ITask, RootTask, SubTask }       from './data-model';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  gapi: any;

  //constructor(gapi_service: any) { 
  //  this.gapi = gapi_service;
  //}

  getTasks(): ITask[] {

    // TODO: USE DATA FROM API
    //gapi.

    let tasks: ITask[] = [
 
      new RootTask(
        "ID1", //taskId;
        "Task 1", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:1]", //notes;
        null //childTasks;
      ),
 
      new RootTask(
        "ID2", //taskId;
        "Task 2", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:2]", //notes;
        null //childTasks;
      ),
 
      new RootTask(
        "ID3", //taskId;
        "Task 3", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:3]", //notes;
        null //childTasks;
      ),
 
      new RootTask(
        "ID4", //taskId;
        "Task 4", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:4]", //notes;
        null //childTasks;
      )

     ];
 
    return tasks;
  }

  getTaskLists(): ITaskList[] {

    // TODO: USE DATA FROM API
 
    let taskLists: ITaskList[] = [
 
      new TaskList(
        "ID1", //taskListId
        "List 1", //title
        null //childTasks
      ),
 
      new TaskList(
        "ID2", //taskListId
        "List 2", //title
        null //childTasks
      )

     ];
 
    return taskLists;
  }
}