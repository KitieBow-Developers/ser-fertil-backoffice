import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanClientData } from './clean_client_data.component';

describe('ClientDataComponent', () => {
  let component: CleanClientData;
  let fixture: ComponentFixture<CleanClientData>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanClientData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CleanClientData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
