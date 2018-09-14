import { TestBed, inject } from '@angular/core/testing';

import { TaskExtrasService } from './task-extras.service';

describe('TaskExtrasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskExtrasService]
    });
  });

  it('should be created', inject([TaskExtrasService], (service: TaskExtrasService) => {
    expect(service).toBeTruthy();
  }));
});
