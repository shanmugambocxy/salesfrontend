import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbisuccesspageComponent } from './sbisuccesspage.component';

describe('SbisuccesspageComponent', () => {
  let component: SbisuccesspageComponent;
  let fixture: ComponentFixture<SbisuccesspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbisuccesspageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbisuccesspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
