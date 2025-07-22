import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private baseUrl = 'http://localhost:3000/api/cuentas'; // ← corregido también

  constructor(private http: HttpClient) { }

  validarCuenta(numeroCuenta: string, idBanco: number, idPersona: number) {
    const params = new HttpParams()
      .set('numeroCuenta', numeroCuenta)
      .set('idBanco', idBanco.toString())
      .set('idPersona', idPersona.toString());

    return this.http.get<any>(`${this.baseUrl}/validar`, { params });
  }
}
