import { TestBed } from '@angular/core/testing';

import { WindowStyleService } from './window-style.service';

describe('WindowStyleService', () => {
  let service: WindowStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
