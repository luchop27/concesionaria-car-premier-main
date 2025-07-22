import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Automovil, AutomovilService } from 'app/services/automovil.service';

@Component({
  selector: 'app-automovil-insertar',
  imports: [FormsModule, CommonModule],
  templateUrl: './automovil-insertar.component.html',
  styleUrl: './automovil-insertar.component.css'
})
export class AutomovilInsertarComponent {
  private service = inject(AutomovilService);

  auto = {
    id_marca: null,
    id_modelo: null,
    id_procedencia: null,
    id_equipamiento: null,
    id_extra: null,
    numero_bastidor: '',
    precio: null,
    descuento: null,
    potencia_fisica: null,
    cilindrada: null,
    numero_plazas: null,
    stock: null
  };

  mensaje = '';
  exito = false;

  constructor(private http: HttpClient) { }

  guardar() {
    this.http.post('http://localhost:3000/api/autos', this.auto).subscribe({
      next: (res) => {
        this.mensaje = 'Automóvil guardado correctamente.';
        this.exito = true;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Automóvil guardado correctamente ✔';
        this.exito = false;
      }
    });
  }
}