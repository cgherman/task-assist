import { TestBed, inject } from '@angular/core/testing';

import { ConfigResolverHandlerService } from './config-resolver-handler.service';

describe('ConfigResolverHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigResolverHandlerService]
    });
  });

  it('should be created', inject([ConfigResolverHandlerService], (service: ConfigResolverHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
