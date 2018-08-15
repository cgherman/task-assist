import { TestBed, inject } from '@angular/core/testing';

import { TaskModifierService } from './task-modifier.service';

describe('TaskModifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskModifierService]
    });
  });

  it('should be created', inject([TaskModifierService], (service: TaskModifierService) => {
    expect(service).toBeTruthy();
  }));
});
