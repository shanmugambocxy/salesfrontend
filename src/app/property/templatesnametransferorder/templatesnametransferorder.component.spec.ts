import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesnametransferorderComponent } from './templatesnametransferorder.component';

describe('TemplatesnametransferorderComponent', () => {
  let component: TemplatesnametransferorderComponent;
  let fixture: ComponentFixture<TemplatesnametransferorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesnametransferorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesnametransferorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
