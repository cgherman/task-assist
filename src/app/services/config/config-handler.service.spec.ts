import { TestBed, inject } from '@angular/core/testing';

import { ConfigHandlerService } from './config-handler.service';

describe('ConfigHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigHandlerService]
    });
  });

  it('should be created', inject([ConfigHandlerService], (service: ConfigHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
