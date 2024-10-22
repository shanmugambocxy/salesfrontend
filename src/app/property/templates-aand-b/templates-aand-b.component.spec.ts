import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesAandBComponent } from './templates-aand-b.component';

describe('TemplatesAandBComponent', () => {
  let component: TemplatesAandBComponent;
  let fixture: ComponentFixture<TemplatesAandBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesAandBComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesAandBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
