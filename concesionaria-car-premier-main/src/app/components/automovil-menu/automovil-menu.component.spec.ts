import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomovilMenuComponent } from './automovil-menu.component';

describe('AutomovilMenuComponent', () => {
  let component: AutomovilMenuComponent;
  let fixture: ComponentFixture<AutomovilMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomovilMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomovilMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
