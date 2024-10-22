import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchallencreateComponent } from './echallencreate.component';

describe('EchallencreateComponent', () => {
  let component: EchallencreateComponent;
  let fixture: ComponentFixture<EchallencreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchallencreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchallencreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
