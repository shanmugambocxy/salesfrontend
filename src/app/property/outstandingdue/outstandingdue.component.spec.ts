import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingdueComponent } from './outstandingdue.component';

describe('OutstandingdueComponent', () => {
  let component: OutstandingdueComponent;
  let fixture: ComponentFixture<OutstandingdueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutstandingdueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutstandingdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
