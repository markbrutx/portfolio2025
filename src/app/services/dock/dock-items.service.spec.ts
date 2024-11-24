import { TestBed } from '@angular/core/testing';

import { DockItemsService } from './dock-items.service';

describe('DockItemsService', () => {
  let service: DockItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DockItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
