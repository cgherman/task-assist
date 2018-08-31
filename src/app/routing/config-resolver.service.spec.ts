import { TestBed, inject } from '@angular/core/testing';

import { ConfigResolver } from './config-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';


describe('ConfigResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ConfigResolver]
    });
  });

  it('should be created', inject([ConfigResolver], (service: ConfigResolver) => {
    expect(service).toBeTruthy();
  }));
});
