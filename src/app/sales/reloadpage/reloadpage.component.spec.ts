import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadpageComponent } from './reloadpage.component';

describe('ReloadpageComponent', () => {
  let component: ReloadpageComponent;
  let fixture: ComponentFixture<ReloadpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReloadpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReloadpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
