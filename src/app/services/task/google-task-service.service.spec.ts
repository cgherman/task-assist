import { TestBed, inject } from '@angular/core/testing';

import { GoogleTaskServiceService } from './google-task-service.service';

describe('GoogleTaskServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleTaskServiceService]
    });
  });

  it('should be created', inject([GoogleTaskServiceService], (service: GoogleTaskServiceService) => {
    expect(service).toBeTruthy();
  }));
});
