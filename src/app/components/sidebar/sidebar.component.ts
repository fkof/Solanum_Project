import { Component, HostListener, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../models/menuItem';
import { AuthService } from '../../services/auth.services';
import { UsuarioService } from '../../services/usuario.services';
import { LoadingServices } from '../../services/loading.services';
import { dataPerfil } from '../../models/dataPerfil';
import { SideBarService } from '../../services/sideBar.services';

interface MenuGroup {
  groupName: string;
  groupIcon: string;
  items: MenuItem[];
  expanded: boolean;
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() menu: MenuItem[] = [];
  menuGroups: MenuGroup[] = [];
  isAuthenticated$
  currentUser$
  isCollapsed = false;

  isMobileMenuOpen = false;
  isMobile = false;

  constructor(private authService: AuthService, private usuarioService: UsuarioService, 
    private loadingService: LoadingServices, private sidebarService: SideBarService) {

    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
    this.checkScreenSize();
    if (this.isAuthenticated$) {
      this.loadingService.setLogin(true);
      this.formarMenu();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.isMobileMenuOpen = false;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['menu']) {
      const currentValue: MenuItem[] = changes['menu'].currentValue;
      this.menuGroups = [
        {
          groupName: 'Principal',
          groupIcon: '🏠',
          expanded: true,
          items: [
            /*
            { descripcionMenu: 'Dashboard', iconoMenu: '📊', urlMenu: '/' },
            { label: 'Mi Perfil', icon: '👤', route: '/mi-perfil' },*/

          ]
        },
        {
          groupName: 'Solicitudes',
          groupIcon: '📝',
          expanded: false,
          items: [
            /*{ label: 'Vacaciones', icon: '🏖️', route: '/vacaciones' },
            { label: 'Permisos', icon: '📋', route: '/permisos' }*/
          ]
        },
        {
          groupName: 'Administración',
          groupIcon: '⚙️',
          expanded: false,
          items: [
            /*
            { label: 'Registro de Empleado', icon: '➕', route: '/registro-empleado' }, // NUEVO
            { label: 'Gestión de Roles', icon: '👥', route: '/roles' },
            { label: 'Asignar Roles', icon: '🔑', route: '/empleado-roles' },
            { label: 'Usuarios', icon: '👨‍💼', route: '/usuarios' }
             */
          ]
        },
        {
          groupName: 'Reportes',
          groupIcon: '📈',
          expanded: false,
          items: [
            /*{ label: 'Reportes Generales', icon: '📑', route: '/reportes' },
            { label: 'Estadísticas', icon: '📉', route: '/estadisticas' }
             */
          ]
        },
        {
          groupName: 'Configuración',
          groupIcon: '🔧',
          expanded: false,
          items: [
            /* { label: 'Preferencias', icon: '⚙️', route: '/configuracion' },
             { label: 'Seguridad', icon: '🔒', route: '/seguridad' }
              */
          ]
        }
      ];



      if (currentValue.length > 0) {
        currentValue.map(item => {

          let x = this.menuGroups.find(itemAgrupado => itemAgrupado.groupName == item.agrupadorMenu)


          x?.items.push(item)
        })

      }
      console.log("this.menuGroups", this.menuGroups)
    }
  }

  formarMenu() {
    this.usuarioService.obtenerOpcionesMenu().subscribe({
      next: (data) => {
      
        this.menuGroups = [
          {
            groupName: 'Principal',
            groupIcon: '🏠',
            expanded: true,
            items: [
              /*
              { descripcionMenu: 'Dashboard', iconoMenu: '📊', urlMenu: '/' },
              { label: 'Mi Perfil', icon: '👤', route: '/mi-perfil' },*/

            ]
          },
          {
            groupName: 'Solicitudes',
            groupIcon: '📝',
            expanded: false,
            items: [
              /*{ label: 'Vacaciones', icon: '🏖️', route: '/vacaciones' },
              { label: 'Permisos', icon: '📋', route: '/permisos' }*/
            ]
          },
          {
            groupName: 'Administración',
            groupIcon: '⚙️',
            expanded: false,
            items: [
              /*
              { label: 'Registro de Empleado', icon: '➕', route: '/registro-empleado' }, // NUEVO
              { label: 'Gestión de Roles', icon: '👥', route: '/roles' },
              { label: 'Asignar Roles', icon: '🔑', route: '/empleado-roles' },
              { label: 'Usuarios', icon: '👨‍💼', route: '/usuarios' }
               */
            ]
          },
          {
            groupName: 'Reportes',
            groupIcon: '📈',
            expanded: false,
            items: [
              /*{ label: 'Reportes Generales', icon: '📑', route: '/reportes' },
              { label: 'Estadísticas', icon: '📉', route: '/estadisticas' }
               */
            ]
          },
          {
            groupName: 'Configuración',
            groupIcon: '🔧',
            expanded: false,
            items: [
              /* { label: 'Preferencias', icon: '⚙️', route: '/configuracion' },
               { label: 'Seguridad', icon: '🔒', route: '/seguridad' }
                */
            ]
          }
        ];

        // Get "dataPerfil" from sessionStorage and handle typing/parsing safely
        let dataPerfilStr = sessionStorage.getItem("dataPerfil");
        let dataPerfil: dataPerfil | null = null;
        if (dataPerfilStr) {
          try {
            dataPerfil = JSON.parse(dataPerfilStr);
          } catch(e) {
            dataPerfil = null;
          }
        }

        // Safely get idMenus
        let idMenus: any = dataPerfil && dataPerfil.usuario && dataPerfil.usuario.idMenus
          ? dataPerfil.usuario.idMenus
          : [];

        // Filter the data using idMenus (array of permitted menu IDs)
        let menuForUser =idMenus.split(',')// Array.isArray(idMenus.split(','))
        console.log("menuForUser",menuForUser)
        
        
       let dataFilter=  data.filter(item => menuForUser.includes(item.idMenu.toString()))
          

          
          console.log("dataFilter",dataFilter)
        if (dataFilter.length > 0) {
          dataFilter.map(item => {

            let x = this.menuGroups.find(itemAgrupado => itemAgrupado.groupName == item.agrupadorMenu)


            x?.items.push(item)
          })
        }
        this.loadingService.setLogin(false);
      },
      error: (err) => {
        this.loadingService.setLogin(false);
        alert('Error al obtener las opciones de menú: ' + err.message);
      }
    })




  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
      this.sidebarService.isCollapsed(this.isCollapsed)
    }
  }

  toggleGroup(group: MenuGroup) {
    if (!this.isCollapsed) {
      group.expanded = !group.expanded;
    }
  }
  closeMobileMenu() {
    if (this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }
}