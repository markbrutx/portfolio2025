import { TestBed } from '@angular/core/testing';

import { WindowBoundsService } from './window-bounds.service';

describe('WindowBoundsService', () => {
  let service: WindowBoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowBoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
