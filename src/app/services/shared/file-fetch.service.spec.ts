import { TestBed, inject } from '@angular/core/testing';
import { FileFetchService } from './file-fetch.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileFetchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileFetchService]
    });
  });

  it('should be created', inject([FileFetchService], (service: FileFetchService) => {
    expect(service).toBeTruthy();
  }));
});
