import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Automovil {
  id_automovil?: number;
  id_marca: number;
  id_modelo: number;
  id_procedencia: number;
  id_equipamiento?: number;
  id_extra?: number;
  numero_bastidor: string;
  precio: number;
  descuento?: number;
  potencia_fisica?: number;
  cilindrada?: number;
  numero_plazas?: number;
  stock?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutomovilService {
  private apiUrl = `${environment.apiUrl}/autos`;

  constructor(private http: HttpClient) { }

  // Obtener todos los vehículos
  getAutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un vehículo
  createAuto(auto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, auto);
  }

  // Actualizar un vehículo
  updateAuto(id: number, auto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, auto);
  }

  // Eliminar un vehículo
  deleteAuto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}