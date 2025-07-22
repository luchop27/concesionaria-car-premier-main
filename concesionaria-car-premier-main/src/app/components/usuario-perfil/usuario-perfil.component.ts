import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.css']
})
export class UsuarioPerfilComponent implements OnInit {
  userData: any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.userData = this.auth.getPerfil();
    console.log('Perfil cargado:', this.userData);
  }

  formatearDocumento(tipo: string): string {
    if (tipo === 'Cedula') return 'Cédula';
    return tipo;
  }
}
