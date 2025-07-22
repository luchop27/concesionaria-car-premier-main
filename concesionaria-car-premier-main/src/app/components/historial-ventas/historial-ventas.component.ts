import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { VentaService } from 'app/services/venta.service';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-historial-ventas',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './historial-ventas.component.html',
  styleUrl: './historial-ventas.component.css'
})
export class HistorialVentasComponent implements OnInit {
  historial: any[] = [];
  id_persona!: number;

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id_persona');
      if (id) {
        this.id_persona = +id;
        this.cargarHistorial();
      }
    });
  }

  cargarHistorial(): void {
    this.ventaService.obtenerHistorialCompras(this.id_persona).subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (error) => {
        console.error('Error cargando historial', error);
      },
    });
  }
}