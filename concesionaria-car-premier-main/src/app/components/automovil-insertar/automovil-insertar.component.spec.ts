import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomovilInsertarComponent } from './automovil-insertar.component';

describe('AutomovilInsertarComponent', () => {
  let component: AutomovilInsertarComponent;
  let fixture: ComponentFixture<AutomovilInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomovilInsertarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomovilInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
