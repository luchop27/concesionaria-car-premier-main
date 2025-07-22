import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioRegisterComponent } from './usuario-register.component';

describe('UsuarioRegisterComponent', () => {
  let component: UsuarioRegisterComponent;
  let fixture: ComponentFixture<UsuarioRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
