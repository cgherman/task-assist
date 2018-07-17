import { TestBed, inject } from '@angular/core/testing';

import { ConfigResolver } from './config-resolver.service';

describe('ConfigResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigResolver]
    });
  });

  it('should be created', inject([ConfigResolver], (service: ConfigResolver) => {
    expect(service).toBeTruthy();
  }));
});
