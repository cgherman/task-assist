import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ITaskList } from '../../../models/task/itask-list';
import { QuadTaskServiceBase } from '../../../services/task/quad-task-service-base';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MSG_GUIDE_SIGNIN_CHOOSE, MSG_GUIDE_NO_LISTS, MSG_GUIDE_CHOOSE_LIST } from '../../../user-messages';

@Component({
  selector: 'app-task',
  templateUrl: './task-frame.component.html',
  styleUrls: ['./task-frame.component.css']
})
export class TaskFrameComponent implements OnInit {
  @Output() taskListChange = new EventEmitter<string>();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  protected subscriptions: Subscription[] = [];
  
  // task data
  public taskLists: Observable<ITaskList[]>;

  // form-related objects
  public openingStatement: string;
  public quadrantForm: FormGroup;

  constructor(protected formBuilder: FormBuilder,
              protected taskService: QuadTaskServiceBase,
              protected crossComponentEventService: CrossComponentEventService) 
  {    
        // initialize form
        this.createForm();
        this.openingStatement = MSG_GUIDE_SIGNIN_CHOOSE;  
  }

  private createForm() {
    this.quadrantForm = this.formBuilder.group({
    taskList: ''
    });
  }

  ngOnInit() {    
    var sub = this.crossComponentEventService.dataReadyToLoad.subscribe(item => this.onDataReadyToLoad());
    this.subscriptions.push(sub); // capture for destruction
    
    var sub = this.taskService.taskListsLoaded.subscribe(taskLists => this.onTaskListsLoaded(taskLists));
    this.subscriptions.push(sub); // capture for destruction
  }

  // value of currently selected task list in dropdown
  get selectedTaskList(): string {
    return this.quadrantForm.get('taskList').value;;
  }
  
  // fired upon task list selection
  onChangeTaskList($event) {
    this.taskListChange.emit(this.selectedTaskList);
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

  // Fired after initial task list is loaded
  private onTaskListsLoaded(taskLists: ITaskList[]){

    // activate first list
    if (taskLists == null || taskLists.length == 0) {
        this.openingStatement = MSG_GUIDE_NO_LISTS;
        this.crossComponentEventService.signalWarningMessageAppend(MSG_GUIDE_NO_LISTS);
    } else {
        this.openingStatement = MSG_GUIDE_CHOOSE_LIST;
        this.quadrantForm.get('taskList').patchValue(taskLists[0].id);
    }
}

}

