import { TestBed, inject } from '@angular/core/testing';

import { AppEventsService } from './app-events.service';

describe('AppEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppEventsService]
    });
  });

  it('should be created', inject([AppEventsService], (service: AppEventsService) => {
    expect(service).toBeTruthy();
  }));
});
