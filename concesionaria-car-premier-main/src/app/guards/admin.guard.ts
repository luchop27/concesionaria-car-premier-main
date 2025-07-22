import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Primero, verifica si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('AdminGuard: Usuario no autenticado. Redirigiendo a /login.');
      return this.router.createUrlTree(['/login']); // Redirige a login si no está autenticado
    }

    // Si está autenticado, verifica si es administrador
    // Usamos el método esAdmin() del AppComponent para la verificación
    // Como esAdmin() en AppComponent usa 'perfil' de localStorage, podemos confiar en ello.
    // Si tu AuthService tiene una forma de obtener el perfil y verificar el admin, úsala.
    // Para simplificar, asumiremos que AppComponent es el lugar central para esAdmin().
    // Idealmente, AuthService debería tener un método para esto.

    // Para evitar una dependencia circular con AppComponent, vamos a replicar la lógica
    // de esAdmin() aquí o asegurarnos de que AuthService pueda proporcionar esta información.
    // Asumamos que AuthService puede decirnos si el usuario actual es admin.
    // SI TU AUTHSERVICE NO TIENE UN METODO esAdmin(), DEBERÁS AGREGARLO O ADAPTAR ESTO.

    // Ejemplo asumiendo que AuthService puede verificar el rol de admin:
    // return this.authService.isAdminUser().pipe( // Suponiendo que isAdminUser() devuelve un Observable<boolean>
    //   map(isAdmin => {
    //     if (isAdmin) {
    //       console.log('AdminGuard: Usuario es administrador. Acceso concedido.');
    //       return true;
    //     } else {
    //       console.log('AdminGuard: Usuario no es administrador. Redirigiendo a /home.');
    //       return this.router.createUrlTree(['/home']); // Redirige a home si no es admin
    //     }
    //   })
    // );

    // Para que funcione con tu setup actual, donde AppComponent tiene esAdmin()
    // y asumiendo que el perfil ya está cargado en localStorage por AuthService
    const storedPerfil = localStorage.getItem('perfil');
    let perfil: any = null;
    if (storedPerfil) {
      try {
        perfil = JSON.parse(storedPerfil);
      } catch (e) {
        console.error('AdminGuard: Error al parsear el perfil desde localStorage', e);
      }
    }

    const isAdmin = perfil?.correo?.endsWith('@concesionariacarpremier.com');

    if (isAdmin) {
      console.log('AdminGuard: Usuario es administrador. Acceso concedido.');
      return true;
    } else {
      console.log('AdminGuard: Usuario no es administrador. Redirigiendo a /home.');
      return this.router.createUrlTree(['/home']); // Redirige a home si no es admin
    }
  }
}
