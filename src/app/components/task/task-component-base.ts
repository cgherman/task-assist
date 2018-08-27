import { Observable, Subscription } from "rxjs";
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from "rxjs/operators";

import { MSG_GUIDE_SIGNIN, MSG_GUIDE_CHOOSE_LIST, MSG_GUIDE_NO_LISTS, MSG_GUIDE_GAPI_ERROR } from '../../user-messages';
import { MENU_QUAD_FOCUS, MENU_QUAD_PLAN, MENU_QUAD_DELEGATE, MENU_QUAD_ELIMINATE, MENU_QUAD_UNSPECIFIED } from './task-menu-values';

import { QuadTaskServiceBase } from "../../services/task/quad-task-service-base";
import { AuthServiceBase } from "../../services/auth/auth-service-base";
import { CrossComponentEventService } from "../../services/shared/cross-component-event.service";
import { ITask } from "../../models/task/itask";
import { ITaskList } from "../../models/task/itask-list";
import { IQuadTask } from "../../models/task/iquad-task";
import { Quadrant } from "../../models/task/quadrant";

export abstract class TaskComponentBase {
    // these subscriptions will be cleaned up by @AutoUnsubscribe
    protected subscriptions: Subscription[] = [];

    // data
    public tasks: Observable<ITask[]>;
    public taskLists: Observable<ITaskList[]>;

    // form-related objects
    public selectedTaskList: string;
    public openingStatement: string;
    public quadrantForm: FormGroup;

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

    constructor(protected formBuilder: FormBuilder,
                protected taskService: QuadTaskServiceBase,
                protected authService: AuthServiceBase,
                protected crossComponentEventService: CrossComponentEventService
            ) {

        // initialize form
        this.createForm();
        this.openingStatement = MSG_GUIDE_SIGNIN;
    }

    private createForm() {
        this.quadrantForm = this.formBuilder.group({
        taskList: ''
        });
    }

    protected wireUpEvents() {
        // wire up data event
        var sub = this.crossComponentEventService.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
        this.subscriptions.push(sub); // capture for destruction

        var sub = this.taskService.taskQuadrantUpdated.subscribe(item => this.onTaskQuadrantUpdated());
        this.subscriptions.push(sub); // capture for destruction

        var sub = this.taskService.errorLoading.subscribe(errorMessage => this.onErrorLoading(errorMessage));
        this.subscriptions.push(sub); // capture for destruction

        var sub = this.taskService.errorSaving.subscribe(errorMessage => this.onErrorSaving(errorMessage));
        this.subscriptions.push(sub); // capture for destruction

        var sub = this.taskService.taskListsLoaded.subscribe(taskLists => this.onTaskListsLoaded(taskLists));
        this.subscriptions.push(sub); // capture for destruction
    }

    // Triggered by app component after user is authorized
    private onDataReadyToLoad(): void {        
        this.getTaskLists();
    }

    // let's fetch the task lists
    getTaskLists() {
        // TODO: error handling
        this.taskLists = this.taskService.getTaskLists();
    }

    protected loadTaskList() {
        var taskListId: string = this.quadrantForm.get('taskList').value;
        console.log("Changing to a different list: " + taskListId);
        this.selectedTaskList = taskListId;
        this.loadTasks(taskListId, true);
    }

    // Fired after initial task list is loaded
    private onTaskListsLoaded(taskLists: ITaskList[]){

        // activate first list
        if (taskLists == null || taskLists.length == 0) {
            this.openingStatement = MSG_GUIDE_NO_LISTS;
            this.crossComponentEventService.signalHeaderMessageAppend(MSG_GUIDE_NO_LISTS);
        } else {
            this.openingStatement = MSG_GUIDE_CHOOSE_LIST;
            this.quadrantForm.get('taskList').patchValue(taskLists[0].id);
        }
    }

    // let's get the tasks
    protected loadTasks(taskListId: string, preferFreshData: boolean = false) {
        // TODO: error handling
        this.tasks = this.taskService.getTasks(taskListId, preferFreshData)
        .pipe(finalize((() => { this.onTasksLoaded(); })));
    }

    // Fired after tasks are loaded up
    private onTasksLoaded() {
        // TODO: Handle any necessary user dialog here
    }

    private onErrorLoading(errorMessage: string) {
        // TODO: error handling; can get a 401 when new code is pushed
        console.log("Error during Google API loading!");
        this.openingStatement = MSG_GUIDE_GAPI_ERROR;
        this.crossComponentEventService.signalHeaderMessageAppend(MSG_GUIDE_GAPI_ERROR);
    }

    private onErrorSaving(errorMessage: string) {
        console.log("Error during Google API saving!");
        this.openingStatement = MSG_GUIDE_GAPI_ERROR;
        this.crossComponentEventService.signalHeaderMessageAppend(MSG_GUIDE_GAPI_ERROR);
    }

    selectTaskAction(selection: any, taskId: any) {
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
            this.taskService.updateTaskQuadrant(taskId, this.selectedTaskList, targetQuadrant);
        }
    }

    protected requestTitleChange(value: string) {
        this.crossComponentEventService.signalTitleChange(value);
    }
    
    private onTaskQuadrantUpdated() {
        // Update model with committed data
        this.loadTasks(this.selectedTaskList);
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
