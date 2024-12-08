import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationinvitingforLOTComponent } from './applicationinvitingfor-lot.component';

describe('ApplicationinvitingforLOTComponent', () => {
  let component: ApplicationinvitingforLOTComponent;
  let fixture: ComponentFixture<ApplicationinvitingforLOTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationinvitingforLOTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationinvitingforLOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
