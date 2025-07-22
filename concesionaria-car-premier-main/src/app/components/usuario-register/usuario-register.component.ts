import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuario-register',
  imports: [ReactiveFormsModule, CommonModule, HttpClientJsonpModule, RouterModule],
  templateUrl: './usuario-register.component.html',
  styleUrls: ['./usuario-register.component.css']
})
export class UsuarioRegisterComponent {
  form: FormGroup;
  mensaje = '';

  constructor(private fb: FormBuilder, private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipo_documento: ['', Validators.required],
      documento: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    });

    // CHEQUEAR MOTIVO
    const reason = localStorage.getItem('logoutReason');
    if (reason === 'expired') {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor vuelve a iniciar sesión.',
        confirmButtonColor: '#3085d6'
      });
      localStorage.removeItem('logoutReason');
    }
  }

  onSubmit() {
    if (this.form.valid && this.form.value.password === this.form.value.confirmPassword) {
      const datos = {
        nombres: this.form.value.nombres,
        apellidos: this.form.value.apellidos,
        tipo_documento: this.form.value.tipo_documento,
        documento: this.form.value.documento,
        direccion: this.form.value.direccion,
        telefono: this.form.value.telefono,
        correo: this.form.value.correo,
        password: this.form.value.password,
        confirmPassword: this.form.value.confirmPassword
      };

      console.log('Datos a enviar:', datos);

      this.http.post<any>('http://localhost:3000/api/users/register', datos).subscribe({
        next: res => {
          localStorage.setItem('token', res.token);
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Tu cuenta ha sido creada correctamente 🎉',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/home']);
          });
          console.log('Token recibido en registro:', res.token);
        },
        error: err => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: err.error?.message || 'Hubo un problema inesperado 😥',
            confirmButtonColor: '#d33'
          });
          console.error(err);
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Verifica todos los campos y asegúrate de que las contraseñas coincidan.',
        confirmButtonColor: '#f0ad4e'
      });
    }
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
