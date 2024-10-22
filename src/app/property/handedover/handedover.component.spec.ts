import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandedoverComponent } from './handedover.component';

describe('HandedoverComponent', () => {
  let component: HandedoverComponent;
  let fixture: ComponentFixture<HandedoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandedoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandedoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
