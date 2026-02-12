import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol.services';
import { Rol } from '../../models/rol';

import { DialogModule } from 'primeng/dialog';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { PickListModule } from 'primeng/picklist';
import { UsuarioService } from '../../services/usuario.services';
import { MenuItem } from '../../models/menuItem';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CardModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    PickListModule,
    ConfirmDialogModule, FormsModule
  ],
  providers: [MessageService, ConfirmationService, RolService],
  templateUrl: './listaRoles.component.html',
  styleUrls: ['./listaRoles.component.scss']
})
export class ListaRolesComponent implements OnInit {
  roles: Rol[] = [];
  loading: boolean = false;
  searchValue: string = '';
  addRol: boolean = false;

  roleName: string = '';
  roleDescription: string = '';

  sourceMenuItems: MenuItem[] = [];
  defaultSourceMenuItems: MenuItem[] = [];
  targetMenuItems: MenuItem[] = [];


  headerSource = "Menús Disponibles";
  isEdit: boolean = false;
  idRol: number = 0;
  usuarioLogueado: number = 0;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private rolService: RolService,
    private usuarioService: UsuarioService,
  ) {
    let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
    this.usuarioLogueado = dataPerfil.usuario.idEmpleado;
  }

  ngOnInit() {
    this.cargarRoles();
    this.cargarMenus();
  }
  cargarMenus() {
    this.usuarioService.obtenerOpcionesMenu().subscribe({
      next: (menu) => {
        this.sourceMenuItems = menu;
        this.defaultSourceMenuItems = menu;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los menús' })
      }
    });
  }
  cargarRoles() {
    this.loading = true;

    this.rolService.getAll().subscribe({
      next: (data) => {
        //console.log("roles cargados", data)
        this.roles = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los roles'
        });
        this.loading = false;
      }
    });
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue = target.value;
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }

  editarRol(rol: Rol) {

    this.isEdit = true;
    this.idRol = rol.idRol;
    this.roleName = rol.nombre;
    this.roleDescription = rol.descripcion
    this.usuarioService.obtenerMenuPorRol(rol.idRol).subscribe({
      next: (menusRelacionados) => {
        this.targetMenuItems = menusRelacionados
        this.sourceMenuItems = this.defaultSourceMenuItems.filter(menuItem => !this.targetMenuItems.some(targetItem => targetItem.idMenu === menuItem.idMenu));
        this.addRol = true;


      }
    })

    this.messageService.add({
      severity: 'info',
      summary: 'Editar',
      detail: `Editando rol: ${rol.nombre}`
    });

    // Navegar a la página de edición
    // this.router.navigate(['/roles/editar', rol.id]);
  }

  eliminarRol(rol: Rol) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el rol "${rol.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-danger',
      //  acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        // Aquí harías la llamada al servicio para eliminar
        this.rolService.delete(rol.idRol, this.usuarioLogueado).subscribe({
          next: (data) => {

            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `El rol "${rol.nombre}" ha sido eliminado`
            });


            this.cargarRoles();
            this.addRol = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          },
        })


      }
    });
  }

  nuevoRol() {
    //console.log('Crear nuevo rol');
    this.cargarMenus();
    this.addRol = true;
    // this.router.navigate(['/roles/nuevo']);
  }
  onHideModal() {

    this.resetForm();
  }
  onSave() {
    if (this.roleName && this.roleDescription && this.targetMenuItems.length > 0) {
      const selectedMenus = this.targetMenuItems.map(item => item.idMenu).join(', ');

      let dataSend = {
        idRol: this.idRol,
        nombre: this.roleName,
        descripcion: this.roleDescription,
        idMenus: selectedMenus,
        idUsuarioModificacion: this.usuarioLogueado

      }
      //console.log("data a enviar :", dataSend)
      if (!this.isEdit) {
        this.rolService.create(dataSend).subscribe({
          next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Rol creado', detail: `Nombre: ${this.roleName}\nDescripción: ${this.roleDescription}\nPermisos: ${selectedMenus}` });
            this.cargarRoles();
            this.resetForm();
            this.addRol = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          }
        });
        //this.resetForm();
        //this.addRol=false;
      } else {
        this.rolService.update(dataSend).subscribe({
          next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Rol actualizado', detail: `Nombre: ${this.roleName}\nDescripción: ${this.roleDescription}\nPermisos: ${selectedMenus}` });
            this.cargarRoles();
            this.resetForm();
            this.addRol = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          },
        })
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos y selecciona al menos un permiso de menú.' });
    }
  }
  resetForm() {
    this.roleName = '';
    this.isEdit = false;
    this.idRol = 0;
    this.roleDescription = '';
    this.sourceMenuItems = this.defaultSourceMenuItems;
    this.targetMenuItems = [];
    this.cargarMenus();


  }
  getSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  getEstadoLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

}
