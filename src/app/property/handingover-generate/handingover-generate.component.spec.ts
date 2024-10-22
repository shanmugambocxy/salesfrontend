import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandingoverGenerateComponent } from './handingover-generate.component';

describe('HandingoverGenerateComponent', () => {
  let component: HandingoverGenerateComponent;
  let fixture: ComponentFixture<HandingoverGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandingoverGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandingoverGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
