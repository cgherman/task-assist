import { TestBed, inject } from '@angular/core/testing';

import { FakeTaskService } from './fake-task.service';

describe('FakeTaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakeTaskService]
    });
  });

  it('should be created', inject([FakeTaskService], (service: FakeTaskService) => {
    expect(service).toBeTruthy();
  }));
});
