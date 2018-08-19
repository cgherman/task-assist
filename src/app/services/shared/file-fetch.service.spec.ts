import { TestBed, inject } from '@angular/core/testing';

import { FileFetchService } from './file-fetch.service';

describe('FileFetchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileFetchService]
    });
  });

  it('should be created', inject([FileFetchService], (service: FileFetchService) => {
    expect(service).toBeTruthy();
  }));
});
