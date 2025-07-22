import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ImagenCarrusel {
  url: string;
  titulo: string;
  subtitulo: string;
  botonTexto: string;
  botonLink: string;
  descripcion: string;
}

interface Vehiculo {
  nombre: string;
  imagen: string;
  descripcion: string;
}

interface Herramienta {
  nombre: string;
  imagen: string;
  descripcion: string;
}

interface Punto {
  nombre: string;
  imagen: string;
  descripcion: string;
}

interface Marca {
  nombre: string;
  imagen: string;
  descripcion: string;
}

@Component({
  selector: 'app-concesionaria-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './concesionaria-home.component.html',
  styleUrl: './concesionaria-home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ConcesionariaHomeComponent {
  imagenes: ImagenCarrusel[] = [
    {
      url: '/carrusel2.webp',
      titulo: 'Conduce al máximo',
      subtitulo: 'La mejor opción para adquirir tu vehículo',
      descripcion: 'Descubre nuestra amplia gama de autos que combinan potencia, estilo y eficiencia. Conduce con confianza, respaldado por un equipo que se preocupa por ti.',
      botonTexto: 'Ver Vehículos',
      botonLink: '/vehiculos'
    },
    {
      url: '/carrusel7.webp',
      titulo: 'Tu nuevo comienzo',
      subtitulo: 'Encuentra el auto perfecto para ti',
      descripcion: 'Da el primer paso hacia nuevas aventuras. Encuentra el modelo que se adapta a tu estilo de vida, con opciones flexibles y beneficios únicos.',
      botonTexto: 'Descúbrelo',
      botonLink: '/vehiculos'
    },
    {
      url: '/carrusel1.jpg',
      titulo: 'Viaja con confianza',
      subtitulo: 'Tecnología, seguridad y confort',
      descripcion: 'Explora vehículos equipados con lo último en innovación y seguridad. Porque tu tranquilidad al volante es nuestra prioridad.',
      botonTexto: 'Explorar',
      botonLink: '/vehiculos'
    }
  ];

  vehiculosDestacados: Vehiculo[] = [
    {
      nombre: 'Toyota Corolla',
      imagen: '/ToyotaCorolla.jpg',
      descripcion: 'Confiabilidad y eficiencia japonesa en cada kilómetro. Ideal para el día a día.'
    },
    {
      nombre: 'Chevrolet Onix',
      imagen: '/ChevroletOnix.jpg',
      descripcion: 'Moderno, económico y perfecto para la ciudad. Un auto pensado para ti.'
    },
    {
      nombre: 'Mazda CX-5',
      imagen: '/MazdaCX-5.jpg',
      descripcion: 'Diseño elegante, gran rendimiento y tecnología avanzada. Vive la experiencia SUV.'
    },
    {
      nombre: 'Kia Sportage',
      imagen: '/KiaSportage.jpg',
      descripcion: 'Espaciosa, segura y con un estilo audaz. Lista para cualquier aventura.'
    }
  ];


  herramientasDestacadas: Herramienta[] = [
    {
      nombre: 'Chasis',
      imagen: '/chasis.png',
      descripcion: 'Estructura base del vehículo que brinda soporte, rigidez y seguridad a todos los componentes.'
    },
    {
      nombre: 'Sistema de Frenos',
      imagen: '/sistemadefrenos.jpg',
      descripcion: 'Garantiza el control y la seguridad al detener el vehículo de forma eficiente y precisa.'
    },
    {
      nombre: 'El motor',
      imagen: '/motor.jpg',
      descripcion: 'El corazón del automóvil, encargado de generar la potencia necesaria para su movimiento.'
    },
    {
      nombre: 'Sistema Eléctrico',
      imagen: '/sistemaelectrico.webp',
      descripcion: 'Conjunto de componentes que alimentan luces, arranque, sensores y sistemas electrónicos del vehículo.'
    }
  ];

  puntosDestacados: Punto[] = [
    {
      nombre: 'Pasaje de las Nieves',
      imagen: '/pasaje.jpg',
      descripcion: 'Ciudad acogedora conocida por su gente cálida y su cercanía a rutas comerciales clave.'
    },
    {
      nombre: 'Machala',
      imagen: '/machala.jpeg',
      descripcion: 'La capital bananera del mundo, un centro comercial y económico vibrante en el sur del país.'
    },
    {
      nombre: 'Huaquillas',
      imagen: '/huaquillas.jpeg',
      descripcion: 'Ciudad fronteriza dinámica, ideal para el comercio binacional y el turismo entre Ecuador y Perú.'
    },
    {
      nombre: 'Santa Rosa',
      imagen: '/santarosa.jpg',
      descripcion: 'Punto estratégico con gran movimiento vehicular y una creciente actividad automotriz.'
    }
  ];

  marcasDestacadas: Marca[] = [
    {
      nombre: 'Toyota',
      imagen: '/toyota.png',
      descripcion: 'Reconocida por su durabilidad, eficiencia y liderazgo global en innovación automotriz.'
    },
    {
      nombre: 'Chevrolet',
      imagen: '/chevrolet.png',
      descripcion: 'Marca americana confiable, con diseños modernos y excelente relación calidad-precio.'
    },
    {
      nombre: 'Mazda',
      imagen: '/mazda.jpeg',
      descripcion: 'Combinación perfecta de elegancia, tecnología y una conducción emocionante.'
    },
    {
      nombre: 'Kia',
      imagen: '/kia.png',
      descripcion: 'Estilo audaz, rendimiento sólido y una de las garantías más confiables del mercado.'
    },
    {
      nombre: 'Ford',
      imagen: '/ford.jpg',
      descripcion: 'Símbolo de potencia e innovación, con una rica historia en vehículos robustos y versátiles.'
    },
    {
      nombre: 'Hyundai',
      imagen: '/hyundai.jpg',
      descripcion: 'Tecnología accesible, diseño moderno y constante evolución en todos sus modelos.'
    },
    {
      nombre: 'Volkswagen',
      imagen: '/volk.png',
      descripcion: 'Ingeniería alemana que destaca por su precisión, seguridad y estilo atemporal.'
    }
  ];
}
