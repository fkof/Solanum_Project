import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar'; // Import PrimeNG AvatarModule
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet, ButtonModule, ToolbarModule, AvatarModule, MenuModule, BadgeModule, RippleModule,Menu],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SolanumSystem';
  items: MenuItem[] | undefined;
  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Administración',
        items: [
          {
            label: 'Panel',
            icon: 'pi pi-objects-column',
            command: () => {
              alert('Panel clicked!');
              this.router.navigate(['/noticias']);
          }
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
          }
        ]
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
          }
        ]
      },
      {
        separator: true
      }
    ];
  }
}
