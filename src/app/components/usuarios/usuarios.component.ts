import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Rol } from '../../models/rol';
import { RolService } from '../../services/rol.services';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.services';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
// interface Rol {
//   name: string;
//   code: string;
//   description: string;
// }

@Component({
  selector: 'app-empleado-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PickListModule,
    CardModule,
    FloatLabelModule,
    ToastModule, TableModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, RolService, ConfirmationService],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent {
  numeroNominaBusqueda: string = '';
  nombreBusqueda: string = '';
  busquedaRealizada: boolean = false;
  visible: boolean = false;
  usuarioList: Usuario[] = [];
  rolesDisponibles: Rol[] = [];
  rolesAsignados: Rol[] = [];
  loading: boolean = false
  targetHeader: string = "testing"
  idUsuarioEdicion:number = 0;
  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private rolService: RolService, private usuarioServices: UsuarioService) {
    //  this.inicializarRoles();
  }

  inicializarRoles(usuario: Usuario) {
    console.log("data");
    this.rolService.getAll().subscribe(data => {

      // Aquí se obtiene un array de roles a partir de usuario.idRoles separado por comas
      let rolesVariables: string[] = [];
      if (usuario.idRoles) {
        rolesVariables = usuario.idRoles.split(',').map((rol: string) => rol.trim());
      }
      this.rolesAsignados = data.filter(rol => rolesVariables.some(x => parseInt(x) === rol.idRol));
      this.rolesDisponibles = data.filter(rol => !rolesVariables.some(x => parseInt(x) === rol.idRol));
    });

  }
  limpiarBusqueda() {

  }
  buscarUsuario() {
    if (!this.numeroNominaBusqueda && this.nombreBusqueda.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor ingresa un número de empleado o nombre para iniciar la busqueda'
      });
      return;
    }

    this.usuarioServices.obtenerUsuariosParametros(this.nombreBusqueda, this.numeroNominaBusqueda).subscribe({
      next: data => {
        this.usuarioList = data;
        this.busquedaRealizada = true;
      }
      , error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    })

  }

  limpiar() {
    this.numeroNominaBusqueda = '';
    this.nombreBusqueda = '';
    this.rolesAsignados = [];
    this.idUsuarioEdicion= 0;
    //this.inicializarRoles();

  }

  guardarRoles() {
    if (!this.nombreBusqueda) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Primero debes buscar un empleado'
      });
      return;
    }

    if (this.rolesAsignados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debes asignar al menos un rol'
      });
      return;
    }

    const rolesNombres = this.rolesAsignados.map(r => r.idRol).join(', ');

    let dataSend = {
      "idUsuario": this.idUsuarioEdicion,
      "idRoles": rolesNombres,
      "idUsuarioCreacion": 999
    }
    this.usuarioServices.asignarRolesUsuario(dataSend).subscribe({
      next:data=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Roles guardados',
          detail: data.mensaje
        });
        this.visible=false;
        this.idUsuarioEdicion=0;
        this.buscarUsuario();
      },error:error=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    })
  


  }

  // Método para manejar el Enter en el campo de número
  onEnterBuscar(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.buscarUsuario();
    }
  }
  getSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  getEstadoLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }
  editarEmpleado(usuario: Usuario) {
    this.visible = true;
    this.idUsuarioEdicion= usuario.idUsuario;
    this.inicializarRoles(usuario);
  }
  resetPassword(usuario:Usuario){
    let dataSend = {correo:usuario.correo,nuevaPassword:'0000'}
    this.usuarioServices.reestablecerContrasena(dataSend).subscribe({
      next:data=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: data.mensaje??''
        });
        
      }
      
    })
  }
  cambioEstado(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de ${usuario.activo?'desactivar':"activar"} el usuario: "${usuario.nombreCompleto}"?`,
      header: 'Confirmar Edicion de estado',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {

        let dataSend = {
          "idUsuario": usuario.idUsuario,
          "activo": !usuario.activo,
          "idUsuarioModificacion": 9999
        }

        this.usuarioServices.cambiarEstadoUsuario(dataSend).subscribe({
          next: data => {
            this.messageService.add({
              severity: 'success',
              summary: 'Modificacion de estado',
              detail: data.mensaje
            });
            this.buscarUsuario()
          }, error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error
            });
          }
        })

      }
    });

  }
}