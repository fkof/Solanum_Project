import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar'; // Import PrimeNG AvatarModule

import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';


import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.services';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MenuItem } from './models/menuItem';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingServices } from './services/loading.services';
//import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProgressSpinnerModule, RouterOutlet, DialogModule, SidebarComponent, ButtonModule, ToolbarModule, AvatarModule, MenuModule, BadgeModule, RippleModule, HeaderComponent],
  templateUrl: './app.component.html',
  // providers: [AuthService],
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SolanumSystem';
  dataMenu: MenuItem[] = [];
  isAuthenticated: boolean = false;
  visible: boolean = false;

  constructor(private router: Router, private authService: AuthService, private loadingServices: LoadingServices) {

  }
  ngOnInit(): void {
    //this.translateService.setTranslation('es');
    this.loadingServices.showLoading$.subscribe({
      next: data => {
        this.visible = data;
      }
    })
  }
  changeLoginState(e: boolean) {
    this.isAuthenticated = e;
  }
  passDataMenu(e: MenuItem[]) {
    this.dataMenu = e;
  }
}
