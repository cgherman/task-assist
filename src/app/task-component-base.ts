import { Observable, Subscription } from "rxjs";
import { ITask } from "./models/itask";
import { ITaskList } from "./models/itask-list";
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFrameComponent } from "./user-frame/user-frame.component";
import { TaskServiceBase } from "./services/task-service-base";
import { TaskModifierServiceBase } from "./services/task-modifier-service-base";
import { finalize } from "rxjs/operators";
import { AuthServiceBase } from "./services/auth-service-base";

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
        'Focus - Urgent & Important',
        'Plan - Important but Non-urgent',
        'Delegate - Urgent but Unimportant',
        'Eliminate - None of the Above',
        'Unspecified / Unsure'
    ];
    /* TODO: Nested menus for different action types
    objectKeys = Object.keys;
    menuActionTask = {
        'Assign Quadrant': ['Focus: Urgent & Important', 'Plan: Important but Not Urgent', 'Delegate: Urgent but Not Important', 'Eliminate: Not urgent & Not Important'],
        'Create Reminder': ['Today AM', 'Today Afternoon', 'Today Evening'],
    };*/

    constructor(protected formBuilder: FormBuilder,
                protected taskService: TaskServiceBase, 
                protected taskModifierService: TaskModifierServiceBase, 
                protected frameComponent: UserFrameComponent,
                protected authService: AuthServiceBase) {
        // initialize form
        this.createForm();
        this.openingStatement = "Sign in!  Then choose here!";
    }

    private createForm() {
        this.quadrantForm = this.formBuilder.group({
        taskList: ''
        });
    }

    protected wireUpEvents() {
        // wire up data event
        var sub = this.frameComponent.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
        this.subscriptions.push(sub); // capture for destruction

        var sub = this.taskModifierService.taskQuadrantUpdated.subscribe(item => this.onTaskQuadrantUpdated());
        this.subscriptions.push(sub); // capture for destruction

        var sub = this.taskService.errorLoadingTasks.subscribe(item => this.onErrorLoadingTasks());
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
        this.loadTasks(taskListId, false);
    }

    // Fired after initial task list is loaded
    // $event: ITaskList[]
    private onTaskListsLoaded($event){
        var taskLists = $event;

        // activate first list
        if (taskLists.length == 0) {
            this.openingStatement = "No task lists found!";
        } else {
            this.openingStatement = "Choose a task list";
            this.quadrantForm.get('taskList').patchValue(taskLists[0].id);
        }

        this.onDataLoaded();
    }
    
    protected abstract onDataLoaded();

    // let's get the tasks
    protected loadTasks(taskListId: string, cachedIsOkay: boolean) {
        // TODO: error handling
        this.tasks = this.taskService.getTasks(taskListId, cachedIsOkay)
        .pipe(finalize((() => { this.onTasksLoaded(); })));
    }

    // Fired after tasks are loaded up
    private onTasksLoaded() {
        // TODO: Handle any necessary user dialog here
    }

    private onErrorLoadingTasks() {
        // TODO: error handling; can get a 401 when new code is pushed
        console.log("Error during Google API call!");
        this.openingStatement = "Error during Google API call!";
        this.authService.signOut();
    }

    selectTaskAction(selection: any, taskId: any) {
        var targetQuadrant: string = null;

        if (selection == 'Focus - Urgent & Important') {
            targetQuadrant = "1";
        }
        if (selection == 'Plan - Important but Non-urgent') {
            targetQuadrant = "2";
        }
        if (selection == 'Delegate - Urgent but Unimportant') {
            targetQuadrant = "3";
        }
        if (selection == 'Eliminate - None of the Above') {
            targetQuadrant = "4";
        }
        if (selection == 'Unspecified / Unsure') {
            targetQuadrant = "0";
        }

        console.log("Requested move of element " + taskId + " (to " + targetQuadrant + ")");
        if (targetQuadrant != null) {
            this.taskModifierService.updateTaskQuadrant(this.taskService, taskId, this.selectedTaskList, targetQuadrant);
        }
    }
    
    private onTaskQuadrantUpdated() {
        // TODO: Optimize reload to remove flicker
        // Update model with committed data
        this.loadTasks(this.selectedTaskList, true);
    }

    // Called by repeater to determine appropriate quadrant for each task
    quadrantMatch(task: ITask, quadrant:string): boolean {
        return this.taskModifierService.checkQuadrantMatch(task, quadrant);
    }
    
}
