import { Injectable }       from '@angular/core';
import { TaskList }       from './data-model';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  constructor() { }

  getTaskLists(): TaskList[] {

    // TODO: USE DATA FROM API
 
    let taskLists: TaskList[] = [
 
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
 
    return taskLists.sort((a, b) => a.title - b.title);
  }
}