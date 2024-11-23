import { TestBed } from '@angular/core/testing';

import { WindowPositionService } from './window-position.service';

describe('WindowPositionService', () => {
  let service: WindowPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
