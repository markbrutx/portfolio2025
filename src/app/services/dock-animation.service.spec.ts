import { TestBed } from '@angular/core/testing';

import { DockAnimationService } from './dock-animation.service';

describe('DockAnimationService', () => {
  let service: DockAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DockAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
