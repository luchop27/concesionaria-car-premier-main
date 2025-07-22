import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenWatcherService } from './services/token-watcher.service';
import { AutoService } from './services/auto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'concesionaria-app';
  isLoggedIn = false;
  perfil: any = null;
  horaActual: string = '';

  constructor(private auth: AuthService, private router: Router, private tokenWatcher: TokenWatcherService, private autoService: AutoService) {
    this.isLoggedIn = this.auth.isAuthenticated();  // inicializa desde localStorage
    this.auth.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();

    const storedPerfil = localStorage.getItem('perfil');
    if (storedPerfil) {
      this.perfil = JSON.parse(storedPerfil);
    }

    this.auth.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        const updatedPerfil = localStorage.getItem('perfil');
        if (updatedPerfil) {
          this.perfil = JSON.parse(updatedPerfil);
        }
      } else {
        this.perfil = null;
      }
    });
    setInterval(() => {
      const ahora = new Date();
      this.horaActual = ahora.toLocaleTimeString();
    }, 1000);
  }

  esAdmin(): boolean {
    return this.perfil?.correo?.endsWith('@concesionariacarpremier.com');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }
  goTo(ruta: string) {
    // Si la ruta es "ofertas" o "personalizacion", validar sesión
    const rutasRestringidas = ['/ofertas', '/personalizacion'];

    if (rutasRestringidas.includes(ruta)) {
      if (!this.auth.isLoggedIn() || this.auth.isTokenExpired()) {
        Swal.fire({
          icon: 'warning',
          title: 'Acceso restringido',
          text: 'Debes iniciar sesión para acceder a esta sección.',
          confirmButtonColor: '#0d6efd',
          confirmButtonText: 'Ir al Login',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
        return; // No navegar a la ruta restringida
      }
    }

    // Si está logueado o ruta sin restricción, navega normal
    this.router.navigate([ruta]);
  }

  resultados: any[] = [];

  onSearch(termino: string): void {
    if (!termino.trim()) return;
    this.autoService.buscarVehiculos(termino).subscribe({
      next: (data) => {
        this.resultados = data;
        console.log('Vehículos encontrados:', this.resultados);
        // Aquí puedes redirigir o mostrar resultados en otro componente
      },
      error: (err) => {
        console.error('Error al buscar vehículos:', err);
      },
    });
  }


}
