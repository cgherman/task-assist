import { TestBed, inject } from '@angular/core/testing';

import { CachedGoogleTaskService } from './cached-google-task.service';

describe('CachedGoogleTaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachedGoogleTaskService]
    });
  });

  it('should be created', inject([CachedGoogleTaskService], (service: CachedGoogleTaskService) => {
    expect(service).toBeTruthy();
  }));
});
