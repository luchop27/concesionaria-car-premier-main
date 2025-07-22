import { TestBed } from '@angular/core/testing';

import { AutomovilService } from './automovil.service';

describe('AutomovilService', () => {
  let service: AutomovilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomovilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
