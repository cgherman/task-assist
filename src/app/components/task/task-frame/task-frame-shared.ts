import { Injectable, Output } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
/**  
 ** Used for communication between TaskFrameComponent and child components from router-outlet
**/
export class TaskFrameShared {
    public taskListChange = new Subject<string>();

    private _selectedTaskList: string;

    public set selectedTaskList(value: string) {
        this._selectedTaskList = value;
        this.taskListChange.next(value);
    }

    public get selectedTaskList(): string {
        return this._selectedTaskList;
    }
}