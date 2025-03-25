import { TestBed } from '@angular/core/testing';

import { CitaMedicalService } from './cita-medical.service';

describe('CitaMedicalService', () => {
  let service: CitaMedicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaMedicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
