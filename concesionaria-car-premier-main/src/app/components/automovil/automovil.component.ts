import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutoService } from 'app/services/auto.service';
import { Automovil, AutomovilService } from 'app/services/automovil.service';

@Component({
  selector: 'app-automovil',
  imports: [CommonModule],
  templateUrl: './automovil.component.html',
  styleUrl: './automovil.component.css'
})
export class AutomovilComponent {
  private automovilService = inject(AutoService);
  autos: Automovil[] = [];

  ngOnInit(): void {
    this.automovilService.getAutos().subscribe({
      next: (data) => {
        this.autos = data;
        console.log('Autos cargados:', this.autos);
      },
      error: (err) => {
        console.error('Error al obtener autos:', err);
      }
    });
  }
  constructor(private router: Router) { }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}