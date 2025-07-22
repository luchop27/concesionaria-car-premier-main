import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  standalone: false // o elimínalo si no estás usando componentes standalone
})
export class AdminPanelComponent {
  constructor(private router: Router) { }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
