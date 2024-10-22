import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatescancellationComponent } from './templatescancellation.component';

describe('TemplatescancellationComponent', () => {
  let component: TemplatescancellationComponent;
  let fixture: ComponentFixture<TemplatescancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatescancellationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatescancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
