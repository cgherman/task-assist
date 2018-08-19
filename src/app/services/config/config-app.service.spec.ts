import { TestBed, inject } from '@angular/core/testing';

import { ConfigAppService } from './config-app.service';

describe('ConfigAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigAppService]
    });
  });

  it('should be created', inject([ConfigAppService], (service: ConfigAppService) => {
    expect(service).toBeTruthy();
  }));
});
