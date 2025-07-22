import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Marca {
  id_marca: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private baseUrl = 'http://localhost:3000/api/marcas'; // Cambia a tu endpoint backend

  constructor(private http: HttpClient) { }

  getAll(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.baseUrl);
  }

  getById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.baseUrl}/${id}`);
  }

  create(marca: Partial<Marca>): Observable<any> {
    return this.http.post(this.baseUrl, marca);
  }

  update(id: number, marca: Partial<Marca>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, marca);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
