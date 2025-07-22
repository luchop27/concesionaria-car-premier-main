import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  loggedIn$ = this.loggedInSubject.asObservable();
  private perfilSubject = new BehaviorSubject<any | null>(null);
  public perfil$ = this.perfilSubject.asObservable();

  constructor() {
    const savedPerfil = localStorage.getItem('perfil');
    if (savedPerfil) {
      this.perfilSubject.next(JSON.parse(savedPerfil));
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  login(token: string) {
    localStorage.setItem('token', token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('usuario', JSON.stringify(payload));
    } catch (e) {
      console.error('No se pudo decodificar el token para obtener el usuario');
    }

    this.loggedInSubject.next(true);
  }


  logout(reason?: string): void {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil'); // También elimina los datos del perfil si los guardas
    this.loggedInSubject.next(false);

    if (reason) {
      localStorage.setItem('logoutReason', reason);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error('Error decodificando token', e);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;

    const now = Math.floor(new Date().getTime() / 1000);
    return payload.exp < now;
  }

  getPerfil() {
    const raw = localStorage.getItem('usuario');
    if (!raw) return null;

    try {
      const p = JSON.parse(raw);
      if (p && p.id_persona) p.id = p.id_persona;
      return p;
    } catch (e) {
      console.error('Perfil corrupto en localStorage', e);
      return null;
    }
  }

  obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  getEmail(): string | null {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return null;

    try {
      const datos = JSON.parse(usuario);
      return datos.email || null; // Asegúrate que en el JWT viene como `email`
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return false;
    const usuario = JSON.parse(usuarioStr);
    return usuario.email?.endsWith('@concesionariacarpremier.com');
  }

  setPerfil(perfil: any) {
    localStorage.setItem('perfil', JSON.stringify(perfil));
    this.perfilSubject.next(perfil); // Notifica a los suscriptores
  }

  clearPerfil() {
    localStorage.removeItem('perfil');
    this.perfilSubject.next(null);
  }

}
