import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotopaymenthistoryComponent } from './gotopaymenthistory.component';

describe('GotopaymenthistoryComponent', () => {
  let component: GotopaymenthistoryComponent;
  let fixture: ComponentFixture<GotopaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GotopaymenthistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GotopaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
