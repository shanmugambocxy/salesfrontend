import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationfeesComponent } from './applicationfees.component';

describe('ApplicationfeesComponent', () => {
  let component: ApplicationfeesComponent;
  let fixture: ComponentFixture<ApplicationfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationfeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
