import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.services';
import { CatalogosService } from '../../services/catalogo.services';
import { Empresa } from '../../models/empresa';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    ButtonModule,
    FloatLabelModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  empresaSeleccionada: Empresa | null = null;
  empresas: Empresa[] = []
  usuario: string = '';
  password: string = '';
  loading: boolean = false;
  idEmpleado: number = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private catalogoService: CatalogosService,
    private router: Router,
  ) {

    if (sessionStorage.getItem("isLogin") != undefined) {
      this.router.navigate(['/main']);
    }
    this.catalogoService.obtenerEmpresas().subscribe({
      next: data => {
        this.empresas = data;
      },
      error: error => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error al obtener la data de empresas',
          detail: error
        });
      }
    })
  }
  onResetPassword() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Contacta al Equpo de RH',
      detail: 'Por favor contacta al equipo de Recursos Humanos para restablecer tu contraseña'
    });
  }

  onLogin() {
    // Validaciones
    if (!this.empresaSeleccionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empresa requerida',
        detail: 'Por favor selecciona una empresa'
      });
      return;
    }

    if (!this.usuario || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor ingresa tu usuario y contraseña'
      });
      return;
    }

    this.loading = true;

    this.authService.login(this.usuario, this.password, this.empresaSeleccionada.idEmpresa).subscribe({
      next: data => {
        sessionStorage.setItem("isLogin", 'true');
        sessionStorage.setItem("token", data.token)
        sessionStorage.setItem("dataPerfil", JSON.stringify(data));
        this.authService.setUsuario(data.usuario.nombreCompleto);
        this.authService.setIsAuthenticated(true);
        //this.isAuthenticatedSubject.next(true)
        this.router.navigate(['/main']);
      }, error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: error
        });
        this.loading = false;
      }
    });
    // window.location.href="/main";

  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }
}
