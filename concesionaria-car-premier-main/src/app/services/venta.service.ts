import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/ventas`;
  constructor(private http: HttpClient) { }

  obtenerHistorial(id_persona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial/${id_persona}`);
  }

  obtenerFacturas(id_persona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/facturas/${id_persona}`);
  }

  obtenerHistorialVentas(id_persona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial/${id_persona}`);
  }

  obtenerHistorialCompras(id_persona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial/${id_persona}`);
  }

  obtenerFacturasPorVenta(id_venta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/facturas/${id_venta}`);
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, venta);
  }

  obtenerVentasUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`);
  }

  descargarFactura(id_venta: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id_venta}/factura`, { responseType: 'blob' });
  }

  // Nuevo método para descargar el PDF
  descargarHistorialPDF(userId: number) {
    return this.http.get(`${this.apiUrl}/historial/pdf/${userId}`, {
      responseType: 'blob' // importante para manejar archivos binarios
    });
  }

  realizarVenta(venta: any): Observable<any> {
    return this.http.post(this.apiUrl, venta);
  }
}
