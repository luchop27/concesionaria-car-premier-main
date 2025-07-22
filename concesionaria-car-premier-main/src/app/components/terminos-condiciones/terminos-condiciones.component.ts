import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.css'
})
export class TerminosCondicionesComponent {

  constructor(private router: Router) { }

  goTo(ruta: string) {
    this.router.navigate([ruta]);
  }
}
