import { ITaskListFactory } from "./itask-list-factory";
import { ITaskList } from "../../models/task/itask-list";
import { FlatTaskList } from "../../models/task/flat-task-list";

export class FlatTaskListFactory implements ITaskListFactory{

    public CreateTaskLists(gapiClientTaskListResponse: any): ITaskList[] {
        return this.parseTaskLists(gapiClientTaskListResponse);
    }

    private parseTaskLists(response: any): FlatTaskList[] {
        var index: number;
        var taskLists = [] as FlatTaskList[];
        
        if (response.result == null || response.result.items == null || response.result.items.length == 0) {
            console.log('No Task Lists found.');
            return null;
        } else {
            console.log('Found ' + response.result.items.length + ' Task LISTS.');

            var task;
            for (var index = 0; index < response.result.items.length; index++) {
            task = new FlatTaskList(response.result.items[index].id,
                                response.result.items[index].title);
            taskLists.push(task);
            }

            return taskLists;
        }
    }
}
