import { Injectable }       from '@angular/core';
import { ITaskList, TaskList, ITask, RootTask, SubTask }       from './data-model';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  TaskService() {
  }

  getTasks(taskListId: string): ITask[] {

    var result = null;

    return result;
  }

  getTaskLists(): ITaskList[] {
    var result = null;

    return result;
  }
}