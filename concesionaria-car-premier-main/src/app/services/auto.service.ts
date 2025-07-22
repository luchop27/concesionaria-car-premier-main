import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutoService {
  private apiUrl = `${environment.apiUrl}/autos`;

  constructor(private http: HttpClient) { }

  getAllAutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerAutosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`);
  }

  getAutoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/id/${id}`);
  }

  buscarVehiculos(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar?termino=${termino}`);
  }

}
