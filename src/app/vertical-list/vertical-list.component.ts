import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFrameComponent } from '../user-frame/user-frame.component';

import { TaskModifierServiceBase } from '../services/task-modifier-service-base';
import { TaskServiceBase } from '../services/task-service-base';
import { TaskService } from '../services/task.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { TaskComponentBase } from '../task-component-base';
import { AuthServiceBase } from '../services/auth-service-base';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.css'],
  providers:  [{ provide: TaskServiceBase, useClass: TaskService }]
})
export class VerticalListComponent extends TaskComponentBase implements OnInit, OnDestroy {
  @ViewChild('triggerRefresh') triggerRefresh: ElementRef;

  constructor(formBuilder: FormBuilder,
              taskService: TaskServiceBase, 
              taskModifierService: TaskModifierServiceBase, 
              frameComponent: UserFrameComponent,
              authService: AuthServiceBase) {
    super(formBuilder, taskService, taskModifierService, frameComponent, authService);
  }

  ngOnInit() {
    this.wireUpEvents();
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngDoCheck() {
  }

  // fired upon task list selection
  onChangeTaskList($event) {
    this.loadTaskList();
  }

  onDataLoaded() {
    // Trigger UI update to notify Angular of GAPI model
    // This is preferable to polling GAPI (polling from ngOnInit does work)
    // Method markForCheck() is not effective at this stage
    this.triggerRefresh.nativeElement.click();
  }

  // Triggered by triggerRefresh event
  onRefresh() {
    // TODO: Handle any necessary user dialog here
  }
}
