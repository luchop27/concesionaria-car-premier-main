import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private baseUrl = 'http://localhost:3000/api/banco'; // Asegúrate que coincida con tu backend

  constructor(private http: HttpClient) { }

  obtenerBancos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
}
