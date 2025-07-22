import { Routes } from '@angular/router';
import { UsuarioLoginComponent } from './components/usuario-login/usuario-login.component';
import { ConcesionariaHomeComponent } from './components/concesionaria-home/concesionaria-home.component';
import { UsuarioRegisterComponent } from './components/usuario-register/usuario-register.component';
import { UsuarioPerfilComponent } from './components/usuario-perfil/usuario-perfil.component';
import { AuthGuard } from './guards/auth.guard';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { VehiculoDetalleComponent } from './components/vehiculo-detalle/vehiculo-detalle.component';
import { VehiculoListaComponent } from './components/vehiculo-lista/vehiculo-lista.component';
import { VentaFormularioComponent } from './components/venta-formulario/venta-formulario.component';
import { HistorialVentasComponent } from './components/historial-ventas/historial-ventas.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AutomovilComponent } from './components/automovil/automovil.component';
import { AutomovilInsertarComponent } from './components/automovil-insertar/automovil-insertar.component';
import { AutomovilMenuComponent } from './components/automovil-menu/automovil-menu.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { PersonalizacionComponent } from './components/personalizacion/personalizacion.component';

export const routes: Routes = [
    { path: 'login', component: UsuarioLoginComponent },
    { path: 'register', component: UsuarioRegisterComponent },
    { path: 'home', component: ConcesionariaHomeComponent },
    { path: 'ofertas', component: OfertasComponent },
    { path: 'personalizacion', component: PersonalizacionComponent },
    { path: 'venta/:id', component: VentaFormularioComponent },
    { path: 'historial-compras/:id_persona', component: HistorialVentasComponent },
    { path: 'administrador', component: AdminPanelComponent },
    { path: 'terminos-condiciones', component: TerminosCondicionesComponent },
    { path: 'listar-automovil', component: AutomovilComponent },
    { path: 'insertar-automovil', component: AutomovilInsertarComponent },
    { path: 'automovil-menu', component: AutomovilMenuComponent },
    { path: 'vehiculo', component: VehiculoListaComponent },
    { path: 'vehiculo/:modelo', component: VehiculoDetalleComponent },
    { path: 'perfil', component: UsuarioPerfilComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
