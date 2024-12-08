import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotbroughtintosaleComponent } from './notbroughtintosale.component';

describe('NotbroughtintosaleComponent', () => {
  let component: NotbroughtintosaleComponent;
  let fixture: ComponentFixture<NotbroughtintosaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotbroughtintosaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotbroughtintosaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
