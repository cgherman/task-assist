import { TestBed, inject } from '@angular/core/testing';

import { CrossComponentEventService } from './cross-component-event.service';

describe('CrossComponentEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrossComponentEventService]
    });
  });

  it('should be created', inject([CrossComponentEventService], (service: CrossComponentEventService) => {
    expect(service).toBeTruthy();
  }));
});
