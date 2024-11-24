import { TestBed } from '@angular/core/testing';

import { DesktopAppRegistryService } from './desktop-app-registry.service';

describe('DesktopAppRegistryService', () => {
  let service: DesktopAppRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesktopAppRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
