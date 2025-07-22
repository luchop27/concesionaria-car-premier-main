import { Component, OnInit } from '@angular/core';
import { AutoService } from '../../services/auto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-vehiculo-lista',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './vehiculo-lista.component.html',
  styleUrl: './vehiculo-lista.component.css'
})
export class VehiculoListaComponent implements OnInit {
  autos: any[] = [];
  error = '';

  constructor(
    private autoService: AutoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.autoService.getAutos().subscribe({
      next: (data) => this.autos = data,
      error: (err) => {
        this.error = 'Error al cargar vehículos';
        console.log('auto', this.autos);
        console.error(err);
      }
    });
  }

  getImagenAuto(auto: any): string {
    // Mapa con modelo como clave y ruta de imagen como valor
    const mapaImagenes: { [key: string]: string } = {
      'Corolla': '/ToyotaCorolla.jpg',
      'Onix': '/ChevroletOnix.jpg',
      'CX-5': '/MazdaCX-5.jpg',
      'Sportage': '/KiaSportage.jpg',
      'Elantra': '/elantra.jpg',
      'Golf': '/golf.jpg',
      'Rio': '/rio.jpg',
      'Fiesta': '/fiesta.jpg'
      // Agrega más modelos aquí
    };

    // Retorna la imagen según el modelo, o placeholder si no existe
    return mapaImagenes[auto.modelo] || 'https://via.placeholder.com/400x200?text=Sin+Imagen';
  }

  verDetalles(auto: any): void {
    if (!this.authService.isLoggedIn() || this.authService.isTokenExpired()) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Para ver los detalles de este vehículo, primero debes iniciar sesión.',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Ir al Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.router.navigate(['/vehiculo', auto.modelo]);
  }

}
