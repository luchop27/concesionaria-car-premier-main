import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoService } from '../../services/auto.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterOutlet } from "../../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehiculo-detalle',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './vehiculo-detalle.component.html',
  styleUrl: './vehiculo-detalle.component.css'
})
export class VehiculoDetalleComponent {
  modeloParam = '';
  autoSeleccionado: any = null;
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private autoService: AutoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.modeloParam = this.route.snapshot.paramMap.get('modelo') ?? '';
    this.obtenerDetalle();
  }

  obtenerDetalle() {
    this.autoService.getAllAutos().subscribe({
      next: (autos) => {
        // Buscamos por modelo
        this.autoSeleccionado = autos.find(a =>
          a.modelo?.toLowerCase().replace(/\s+/g, '') === this.modeloParam.toLowerCase()
        );

        if (!this.autoSeleccionado) {
          this.error = 'Vehículo no encontrado.';
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los datos.';
        this.cargando = false;
      }
    });
  }

  comprar() {
    if (this.authService.isLoggedIn()) {
      console.log(this.autoSeleccionado); // Para confirmar el campo

      const id = this.autoSeleccionado?.id_automovil;
      if (id) {
        this.router.navigate(['/venta', id]);
      } else {
        Swal.fire('Error', 'No se pudo obtener el ID del vehículo.', 'error');
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  extractYouTubeId(url: string): string {
    const youtubeRegex = /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : '';
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
