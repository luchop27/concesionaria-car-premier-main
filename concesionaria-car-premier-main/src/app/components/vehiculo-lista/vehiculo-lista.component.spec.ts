import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculoListaComponent } from './vehiculo-lista.component';

describe('VehiculoListaComponent', () => {
  let component: VehiculoListaComponent;
  let fixture: ComponentFixture<VehiculoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculoListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
