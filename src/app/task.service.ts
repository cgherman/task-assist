import { Injectable } from '@angular/core';
import { ITaskList, TaskList, ITask, RootTask, SubTask } from './data-model';
import { ITaskService } from './itask-service';

@Injectable({
  providedIn: 'root'
})

export class TaskService implements ITaskService {

  TaskService() {
  }

  getTasks(): ITask[] {

    let tasks: ITask[] = [
 
      new RootTask(
        "ID1", //taskId;
        "Fake Task 1", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:1]", //notes;
      ),
 
      new RootTask(
        "ID2", //taskId;
        "Fake Task 2", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:1]", //notes;
      ),
 
      new RootTask(
        "ID3", //taskId;
        "Fake Task 3", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:3]", //notes;
      ),
 
      new RootTask(
        "ID4", //taskId;
        "Fake Task 4", //title;
        "https://developers.google.com/apis-explorer/#s/tasks/v1/tasks.tasks.get?tasklist=X&task=Y", //selfLink;
        "needsAction", //status;
        "[Quad:4]", //notes;
      )

     ];
 
    return tasks;
  }

  getTaskLists(): ITaskList[] {

    let taskLists: ITaskList[] = [
 
      new TaskList(
        "ID1", //taskListId
        "Fake List 1", //title
      ),
 
      new TaskList(
        "ID2", //taskListId
        "Fake List 2", //title
      )

     ];
 
    return taskLists;
  }
}