import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandingoverGeneratedComponent } from './handingover-generated.component';

describe('HandingoverGeneratedComponent', () => {
  let component: HandingoverGeneratedComponent;
  let fixture: ComponentFixture<HandingoverGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandingoverGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandingoverGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
