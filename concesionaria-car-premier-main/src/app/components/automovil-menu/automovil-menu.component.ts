import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-automovil-menu',
  imports: [],
  templateUrl: './automovil-menu.component.html',
  styleUrl: './automovil-menu.component.css'
})
export class AutomovilMenuComponent {
  constructor(private router: Router) { }

  goTo(ruta: string) {
    this.router.navigate([ruta]);
  }
}
