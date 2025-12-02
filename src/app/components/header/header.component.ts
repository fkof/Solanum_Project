import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { UsuarioService } from '../../services/usuario.services';
import { MenuItem } from '../../models/menuItem';
import { MessageService, MenuItem as primeMenuItem } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

import { Router } from '@angular/router';
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";
@Component({
  selector: 'app-header',
  //  standalone: true,
  imports: [CommonModule, FormsModule, PasswordModule, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showModal = false;
  showError = false;
  username = 's';
  password = 's';
  newPassword: string = '';
  confirmPassword: string = '';
  isAuthenticated$;
  currentUser$;
  @Output() isLogin: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataMenu: EventEmitter<MenuItem[]> = new EventEmitter<MenuItem[]>();
  logueado = false;
  correoUsuario :string='';
  showUserMenu = false;
  userMenuItems: primeMenuItem[] = [];

  constructor(public authService: AuthService, public usuarioService: UsuarioService, private router: Router, private messageService: MessageService) {

    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
    this.isLogin.emit(this.isAuthenticated$ ? false : this.isAuthenticated$)
    let perfilLocal = JSON.parse(sessionStorage.getItem("dataPerfil")?? JSON.stringify( {usuario:{cooreo:""}}))
    this.correoUsuario = perfilLocal.usuario.correo;
    this.initUserMenu();
  }
  initUserMenu() {
    this.userMenuItems = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['/mi-perfil']);
          this.showUserMenu = false;
        }
      },
      {
        label: 'Restablecer Contraseñassss',
        icon: 'pi pi-key',
        command: () => {
          this.abrirRestablecerPassword();
          this.showUserMenu = false;
        }
      },
      {
        separator: true
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.onLogout();
          this.showUserMenu = false;
        }
      }
    ];
  }
  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenuOnClickOutside() {
    this.showUserMenu = false;
  }

  abrirRestablecerPassword() {
  this.showModal=true;
  }
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(nombre => {
      console.log("nombre desde el init", nombre)
      this.isLogin.emit(nombre)

    });
    if (typeof document !== 'undefined') {
      document.addEventListener('click', () => {
        this.closeUserMenuOnClickOutside();
      });
    }

  }


  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.username = '';
    this.password = '';
  }
  resetPassword() {
    if (this.newPassword != this.confirmPassword) {
      this.showError = true;
      return;
    }
    let perfilLocal = JSON.parse(sessionStorage.getItem("dataPerfil")??"")
    let dataSend = {correo:perfilLocal.usuario.correo,nuevaPassword:this.newPassword}
    this.usuarioService.reestablecerContrasena(dataSend).subscribe({
      next:data=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: data.mensaje??''
        });
        this.newPassword= '';
        this.confirmPassword = '';
      }
      
    })
    this.showModal=false;
    this.showError = false;

  }
  onLogin() {


  }

  onLogout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      this.authService.logout();
      this.isLogin.emit(this.isAuthenticated$ ? false : this.isAuthenticated$)
      this.router.navigate(['/']);
    }
  }

  onModalBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }
}