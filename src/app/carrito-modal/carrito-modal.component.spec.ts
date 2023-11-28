import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoModalComponent } from './carrito-modal.component';

describe('CarritoModalComponent', () => {
  let component: CarritoModalComponent;
  let fixture: ComponentFixture<CarritoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
