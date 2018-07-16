import { ITask } from './itask';
import { TaskList } from './task-list';
import { ITaskContainer } from './itask-container';

// task list that contains task object data
export class TaskListPopulated extends TaskList implements ITaskContainer {

    tasks: ITask[];
  
    constructor (public taskListId: string, title: string, tasks: ITask[]) {
      super(taskListId, title);
      this.tasks = tasks;
    }
  
    get taskCount(): number {
      if (this.tasks == null) {
        return 0;
      }
  
      return this.tasks.length;
    }
  }
  