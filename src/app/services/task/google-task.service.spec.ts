import { TestBed, inject } from '@angular/core/testing';

import { GoogleTaskService } from './google-task.service';

describe('GoogleTaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleTaskService]
    });
  });

  it('should be created', inject([GoogleTaskService], (service: GoogleTaskService) => {
    expect(service).toBeTruthy();
  }));
});
