import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './usuario-login.component.html',
  styleUrl: './usuario-login.component.css'
})
export class UsuarioLoginComponent {
  form: FormGroup;
  mensaje = '';

  constructor(private fb: FormBuilder, private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const datos = this.form.value;

      this.http.post<any>('http://localhost:3000/api/users/login', datos).subscribe({
        next: res => {
          // Guardas los datos de sesión como siempre
          this.auth.login(res.token);
          this.auth.setPerfil(res.perfil);
          localStorage.setItem('perfil', JSON.stringify(res.perfil));

          Swal.fire({
            icon: 'success',
            title: '¡Autenticación exitosa!',
            text: 'Bienvenido nuevamente 😊',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
            // En lugar de this.auth.isAdmin(), verificamos directamente la respuesta.
            // Nos aseguramos de que 'res.perfil' y 'res.perfil.correo' existan antes de la comprobación.
            if (res.perfil && res.perfil.correo && res.perfil.correo.endsWith('@concesionariacarpremier.com')) {
              console.log("¡Usuario es Admin! Redirigiendo a /administrador");
              this.router.navigate(['/administrador']);
            } else {
              console.log("Usuario no es Admin. Redirigiendo a /home");
              this.router.navigate(['/home']);
            }
          });
        },
        error: err => {
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: err.error?.message || 'Hubo un problema inesperado 😥',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor verifica todos los campos.',
        confirmButtonColor: '#f0ad4e'
      });
    }
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
