import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesallotmentorderComponent } from './templatesallotmentorder.component';

describe('TemplatesallotmentorderComponent', () => {
  let component: TemplatesallotmentorderComponent;
  let fixture: ComponentFixture<TemplatesallotmentorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesallotmentorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesallotmentorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
