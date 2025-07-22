import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenWatcherService {
  constructor(private auth: AuthService, private router: Router) {
    this.checkTokenExpiration();
  }

  checkTokenExpiration() {
    setInterval(() => {
      if (this.auth.isLoggedIn() && this.auth.isTokenExpired()) {
        this.auth.logout('expired');

        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    }); // cada 10 segundos
  }
}
