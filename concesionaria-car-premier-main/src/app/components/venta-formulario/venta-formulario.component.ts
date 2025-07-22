import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoService } from 'app/services/auto.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'app/services/auth.service';
import { CuentaService } from 'app/services/cuenta.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-venta-formulario',
  templateUrl: './venta-formulario.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class VentaFormularioComponent implements OnInit {
  // --- Propiedades del Componente ---
  formulario!: FormGroup;
  auto: any;
  persona: any = null;
  datosCuenta: any = null;
  facturaGenerada: boolean = false;
  urlFactura: string = '';
  bancos: any[] = [];
  mensajeCompra: string = '';
  compraExitosa: boolean = false;
  mensajeError: string = '';
  enviando = false;

  constructor(
    private route: ActivatedRoute,
    private autoService: AutoService,
    private ventaService: VentaService,
    private http: HttpClient,
    private auth: AuthService,
    private cuentaService: CuentaService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      idPersona: ['', Validators.required], // Este campo ya existe en el formulario
      idBanco: [null, Validators.required],
      numeroCuenta: ['', [Validators.required, Validators.maxLength(20)]]
    });

    this.persona = this.auth.getPerfil();
    console.log('Perfil obtenido:', this.persona);

    if (this.persona?.id) {
      this.formulario.patchValue({ idPersona: this.persona.id });
    } else {
      console.error("Error: El 'id' del usuario no está disponible en el perfil.");
      this.mensajeCompra = "No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.";
      this.formulario.disable();
    }

    this.http.get<any[]>('http://localhost:3000/api/bancos').subscribe({
      next: (bancos) => this.bancos = bancos,
      error: (err) => console.error('Error al cargar bancos:', err)
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.autoService.getAutoById(id).subscribe(auto => {
          this.auto = auto;
          console.log('Vehículo recibido:', this.auto);
        });
      }
    });
  }

  /**
   * Valida la cuenta bancaria contra el backend.
   */
  validarCuenta() {
    if (this.formulario.invalid) {
      this.mensajeCompra = 'Por favor, seleccione un banco e ingrese un número de cuenta.';
      this.compraExitosa = false;
      return;
    }

    const { idPersona, idBanco, numeroCuenta } = this.formulario.value;

    console.log('Validando con los siguientes datos:', { idPersona, idBanco, numeroCuenta });

    this.cuentaService.validarCuenta(numeroCuenta, idBanco, idPersona).subscribe({
      next: (res) => {
        console.log("✅ Cuenta válida:", res);
        this.datosCuenta = res;
      },
      error: (err) => {
        console.error("❌ Error al validar cuenta:", err);
        this.mensajeError = '❌ Cuenta no válida o no encontrada. Verifique los datos.';
        this.datosCuenta = null;
      }
    });
  }

  /**
   * Confirma la compra si la cuenta es válida y el saldo es suficiente.
   */
  confirmarCompra(): void {
    if (this.enviando) return; // impide doble ejecución
    this.enviando = true;
    console.log('🟢 Método confirmarCompra() ejecutado');
    // --- NUEVA VERIFICACIÓN: Validez del formulario ---
    if (this.formulario.invalid) {
      this.mensajeCompra = 'Por favor, complete todos los campos requeridos del formulario (ID Persona, Banco, Número de Cuenta).';
      this.compraExitosa = false;
      return;
    }

    if (!this.datosCuenta) {
      this.mensajeCompra = 'Por favor, valide su cuenta bancaria primero.';
      this.compraExitosa = false;
      return;
    }

    // --- VERIFICACIÓN MEJORADA DE DATOS DEL AUTO ---
    if (!this.auto || !this.auto.id_automovil || typeof this.auto.precio === 'undefined' || this.auto.precio === null) {
      console.error('Datos del auto incompletos o no cargados:', this.auto);
      this.mensajeCompra = '❌ Error: Los datos del vehículo no están disponibles o incompletos. Intente de nuevo.';
      return;
    }

    if (this.datosCuenta.saldo < this.auto.precio) {
      this.mensajeCompra = '❌ Saldo insuficiente para realizar la compra.';
      this.compraExitosa = false;
      return;
    }

    const datosVenta = {
      id_automovil: this.auto.id_automovil,
      forma_pago: 'Contado',
      id_banco: this.formulario.get('idBanco')?.value,
      numero_cuenta: this.formulario.get('numeroCuenta')?.value,
      fecha_entrega: new Date(),
      matricula: 'XXX-123',
      encargado_fabrica: 'Encargado X',
      total: this.auto.precio,
      // --- ¡CAMBIO CLAVE AQUÍ! Incluir id_persona en el payload ---
      id_persona: this.formulario.get('idPersona')?.value
    };

    console.log('Confirmando compra con:', datosVenta);

    const token = this.auth.getToken();

    if (!token) {
      console.error('No se encontró token de autenticación. El usuario no está logueado o el token no está disponible.');
      this.mensajeCompra = '❌ Error de autenticación. Por favor, inicie sesión de nuevo.';
      this.compraExitosa = false;
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post(`${environment.apiUrl}/ventas/confirmar-compra`, datosVenta, { headers, withCredentials: true }).subscribe({
      next: (res: any) => {
        this.facturaGenerada = true;
        this.urlFactura = `http://localhost:3000${res?.factura_url || ''}`;
        this.mensajeCompra = '✅ ¡Compra realizada con éxito! Factura generada.';
        this.compraExitosa = true;
        console.log('Respuesta de confirmación:', res);
        this.bajarStockVehiculo();
        // 👉 Redirigir al historial después de unos segundos
        setTimeout(() => {
          this.router.navigate(['/ventas/historial']); // Asegúrate de que esta ruta exista
        }, 2000); // Espera 2 segundos antes de redirigir
      },
      error: (e) => {
        // ANTES:
        // console.error('Error al confirmar compra:', e);

        // --- CAMBIO SUGERIDO ---
        // AHORA: Muestra el cuerpo del error que envía el backend.
        console.error('Error al confirmar compra:', e); // Sigue dejando el log completo
        console.error('Detalle del error del backend:', e.error); // ¡Este es el más importante!

        this.mensajeCompra = '❌ Error al registrar la venta.';
        this.compraExitosa = false;

        // Puedes incluso mostrar el mensaje del backend al usuario
        if (e.error && e.error.message) {
          this.mensajeCompra = `❌ Error: ${e.error.message}`;
        }
      }
    });
  }

  /**
   * Llama al endpoint para reducir el stock del vehículo.
   */
  bajarStockVehiculo(): void {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
