import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductModalComponent } from './addproduct-modal.component';

describe('AddproductModalComponent', () => {
  let component: AddproductModalComponent;
  let fixture: ComponentFixture<AddproductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddproductModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddproductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
