import { TestBed } from '@angular/core/testing';

import { OpenAppService } from './open-app.service';

describe('OpenAppService', () => {
  let service: OpenAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
