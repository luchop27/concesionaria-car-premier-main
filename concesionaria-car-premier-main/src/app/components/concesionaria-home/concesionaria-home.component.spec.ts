import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcesionariaHomeComponent } from './concesionaria-home.component';

describe('ConcesionariaHomeComponent', () => {
  let component: ConcesionariaHomeComponent;
  let fixture: ComponentFixture<ConcesionariaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcesionariaHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcesionariaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
