import { TestBed, inject } from '@angular/core/testing';

import { GoogleTaskBuilderService } from './google-task-builder.service';

describe('GoogleTaskBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleTaskBuilderService]
    });
  });

  it('should be created', inject([GoogleTaskBuilderService], (service: GoogleTaskBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
