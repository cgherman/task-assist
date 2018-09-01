import { Observable, Subscription, of } from "rxjs";
import { take } from "rxjs/operators";

import { MSG_GUIDE_GAPI_ERROR, MSG_GUIDE_NO_TASKS } from '../../user-messages';
import { MENU_QUAD_FOCUS, MENU_QUAD_PLAN, MENU_QUAD_DELEGATE, MENU_QUAD_ELIMINATE, MENU_QUAD_UNSPECIFIED } from './task-menu-values';

import { QuadTaskServiceBase } from "../../services/task/quad-task-service-base";
import { CrossComponentEventService } from "../../services/shared/cross-component-event.service";
import { ITask } from "../../models/task/itask";
import { Quadrant } from "../../models/task/quadrant";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { IQuadTask } from "../../models/task/iquad-task";
import { TaskFrameComponent } from "./task-frame/task-frame.component";

export abstract class TaskComponentBase {
    // these subscriptions will be cleaned up by @AutoUnsubscribe
    protected subscriptions: Subscription[] = [];

    // task data
    public tasks: Observable<ITask[]>;

    // action menu
    protected menuActionTask = [
        MENU_QUAD_FOCUS,
        MENU_QUAD_PLAN,
        MENU_QUAD_DELEGATE,
        MENU_QUAD_ELIMINATE,
        MENU_QUAD_UNSPECIFIED
    ];
    /* TODO: Nested menus for different action types
    objectKeys = Object.keys;
    menuActionTask = {
        'Assign Quadrant': ['Focus: Urgent & Important', 'Plan: Important but Not Urgent', 'Delegate: Urgent but Not Important', 'Eliminate: Not urgent & Not Important'],
        'Create Reminder': ['Today AM', 'Today Afternoon', 'Today Evening'],
    };*/

    constructor(protected taskFrame: TaskFrameComponent,
                protected taskService: QuadTaskServiceBase,
                protected crossComponentEventService: CrossComponentEventService
            )
    {
    }

    protected wireUpCommonInit() {
        var sub = this.taskService.errorLoading.subscribe(errorMessage => this.onErrorLoading(errorMessage));
        this.subscriptions.push(sub); // capture for destruction

        sub = this.taskService.errorSaving.subscribe(errorMessage => this.onErrorSaving(errorMessage));
        this.subscriptions.push(sub); // capture for destruction

        sub = this.taskService.tasksLoaded.subscribe(tasksInList => this.onTasksLoaded(tasksInList));
        this.subscriptions.push(sub); // capture for destruction

        sub = this.taskFrame.taskListChange.subscribe(taskListId => this.onTaskListChange(taskListId));
        this.subscriptions.push(sub); // capture for destruction

        if (this.taskFrame.selectedTaskList != null && this.taskFrame.selectedTaskList.length > 0) {
            this.refreshTasks(this.taskFrame.selectedTaskList);
        }
    }

    onTaskListChange(taskListId: string) {
        this.loadTasks(taskListId, true);
    }

    // let's get the tasks
    protected loadTasks(taskListId: string, initialLoad: boolean = true) {
        if (initialLoad) {
          console.log("Changing to a different list: " + taskListId);
          this.tasks = this.taskService.getTasks(taskListId, false);
        } else {
            // prevent flicker
            this.refreshTasks(taskListId);
        }
    }

    private refreshTasks(taskListId: string) {
        var thing: Observable<ITask[]> = this.taskService.getTasks(taskListId, false).pipe(take(1));
        thing.toPromise().then((tasksResult) => {
            this.tasks = of(tasksResult);
        });
    }

    // Fired after tasks are loaded up
    private onTasksLoaded(tasksInList: ITasksInList) {
        if (tasksInList.tasks == null || tasksInList.tasks.length == 0) {
          this.crossComponentEventService.signalWarningMessageAppend(MSG_GUIDE_NO_TASKS);
        } else {
          this.crossComponentEventService.signalWarningMessageClear();
        }
    }

    private onErrorLoading(errorMessage: string) {
        // TODO: error handling; can get a 401 when new code is pushed
        console.log("Error during Google API loading!");
        this.taskFrame.openingStatement = MSG_GUIDE_GAPI_ERROR;
        this.crossComponentEventService.signalWarningMessageAppend(MSG_GUIDE_GAPI_ERROR);
    }

    private onErrorSaving(errorMessage: string) {
        console.log("Error during Google API saving!");
        this.taskFrame.openingStatement = MSG_GUIDE_GAPI_ERROR;
        this.crossComponentEventService.signalWarningMessageAppend(MSG_GUIDE_GAPI_ERROR);
    }

    selectMenuAction(selection: any, taskId: any) {
        var targetQuadrant: Quadrant = null;

        switch(selection) { 
            case MENU_QUAD_FOCUS: { 
                targetQuadrant = Quadrant.newQuadrant("1");
               break; 
            }
            case MENU_QUAD_PLAN: { 
                targetQuadrant = Quadrant.newQuadrant("2");
               break; 
            }
            case MENU_QUAD_DELEGATE: { 
                targetQuadrant = Quadrant.newQuadrant("3");
               break; 
            }
            case MENU_QUAD_ELIMINATE: { 
                targetQuadrant = Quadrant.newQuadrant("4");
               break; 
            }
            default: { 
                targetQuadrant = Quadrant.newQuadrantUnselected();
               break; 
            }
        }

        console.log("Requested move of element " + taskId + " (to " + targetQuadrant.selection.toString() + ")");
        if (targetQuadrant != null) {
            this.executeMenuAction(taskId, this.taskFrame.selectedTaskList, targetQuadrant);
        }
    }

    protected abstract executeMenuAction(taskId: string, taskListId: string, targetQuadrant: Quadrant);

    protected requestTitleChange(value: string) {
        this.crossComponentEventService.signalTitleChange(value);
    }
    
    // Called by repeater to determine appropriate quadrant for each task
    quadrantMatch(task: IQuadTask, quadrantChar:string): boolean {
        // if title is empty, then do not show task in UI
        if (task.title == null || task.title.length == 0) {
            return false;
        }

        if (task.quadrant.isUnselected()) {
            // If quadrant is not specified, match the task to the "unknown" UI category
            return (quadrantChar == null || quadrantChar == "0");
        } else {
            // check for a match
            return Quadrant.isQuadrantMatch(task.quadrant, quadrantChar);
        }
    }    
}
