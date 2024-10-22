import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllschemedataComponent } from './allschemedata.component';

describe('AllschemedataComponent', () => {
  let component: AllschemedataComponent;
  let fixture: ComponentFixture<AllschemedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllschemedataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllschemedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
