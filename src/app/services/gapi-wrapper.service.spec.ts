import { TestBed, inject } from '@angular/core/testing';

import { GapiWrapperService } from './gapi-wrapper.service';

describe('GapiWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GapiWrapperService]
    });
  });

  it('should be created', inject([GapiWrapperService], (service: GapiWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
