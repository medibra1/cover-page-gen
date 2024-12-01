import { TestBed } from '@angular/core/testing';

import { CoverPageService } from './cover-page.service';

describe('CoverPageService', () => {
  let service: CoverPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
