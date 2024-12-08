import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenforfcfsComponent } from './openforfcfs.component';

describe('OpenforfcfsComponent', () => {
  let component: OpenforfcfsComponent;
  let fixture: ComponentFixture<OpenforfcfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenforfcfsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenforfcfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
