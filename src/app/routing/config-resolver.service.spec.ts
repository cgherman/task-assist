import { TestBed, inject } from '@angular/core/testing';

import { ConfigResolver } from './config-resolver.service';

describe('ConfigResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigResolver]
    });
  });

  it('should be created', inject([ConfigResolver], (service: ConfigResolver) => {
    expect(service).toBeTruthy();
  }));
});
