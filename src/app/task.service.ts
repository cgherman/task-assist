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

/*     gapi.client.tasks.list( {tasklist: taskListId
      }).then(function(response) {
      if (response.result != null && response.result.items != null && response.result.items.length != 0) {
        var result = RootTask[response.result.items.length];

        var index: number;
        for (index = 0; index < response.result.items.length; index++) {
          result[index] = new RootTask(response.result.items[index].id,
                                       response.result.items[index].title,
                                       response.result.items[index].selfLink,
                                       response.result.items[index].status,
                                       response.result.items[index].notes
                                      );
        }
      }
    });
 */  
    return result;
  }

  getTaskLists(): ITaskList[] {
    var result = null;

/*     gapi.client.tasks.tasklists.list({
    }).then(function(response) {
      if (response.result != null && response.result.items != null && response.result.items.length != 0) {
        var result = TaskList[response.result.items.length];

        var index: number;
        for (index = 0; index < response.result.items.length; index++) {
          result[index] = new TaskList(response.result.items[index].id,
                                       response.result.items[index].title);
        }
      }
    });
 */  
    return result;
  }
}