import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];
  images: any[] = [{
    itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
    thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
    alt: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    title: 'Title 1'
  },
  {
    itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
    thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
    alt: 'lorem ipsum dolor sit amet consectetur adipiscing elit dolor sit amet consectetur adipiscing elit',
    title: 'Title 2'
  },];
  cards = [
    {
      icon: '🏖️',
      title: 'Solicitudes de Vacaciones',
      description: 'Gestiona y envía tus solicitudes de vacaciones. Consulta tu saldo disponible y el historial de solicitudes anteriores.'
    },
    {
      icon: '📋',
      title: 'Solicitudes de Permisos',
      description: 'Solicita permisos por diferentes motivos. Revisa el estado de tus solicitudes pendientes y aprobadas.'
    }
  ];
}