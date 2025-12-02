import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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