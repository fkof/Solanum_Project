import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CatalogosService } from '../../../services/catalogo.services';
import { EmpleadosService } from '../../../services/emplados.services';
import { Empresa } from '../../../models/empresa';
import { Empleado, EmpleadoBusqueda } from '../../../models/empleado';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-busqueda-empleados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SelectModule,
    CardModule,
    ToastModule,
    FloatLabelModule,
    ConfirmDialogModule,
    TooltipModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './busquedaEmpleados.component.html',
  styleUrls: ['./busquedaEmpleados.component.scss']
})
export class BusquedaEmpleadosComponent implements OnInit {
  // Filtros de búsqueda
  nombreBusqueda: string = '';
  numeroNominaBusqueda: string = '';
  empresaSeleccionada: Empresa | null = null;

  // Datos
  empresas: Empresa[] = [];
  empleados: EmpleadoBusqueda[] = [];
  loading: boolean = false;
  busquedaRealizada: boolean = false;
  totalRegistros: number = 0;
  usuarioLogueado: number = 0;
  constructor(
    private messageService: MessageService,
    private catalogoService: CatalogosService,
    private empleadoService: EmpleadosService,
    private router: Router,
    private confirmationService: ConfirmationService

  ) {
    let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
    this.usuarioLogueado = dataPerfil.usuario.idEmpleado;

  }

  ngOnInit() {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.catalogoService.obtenerEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
      }, error: (data) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: data
        });
      }
    })
  }

  buscarEmpleados() {
    // Validación: al menos un criterio de búsqueda

    this.loading = true;
    this.busquedaRealizada = true;


    // Ejemplo con servicio real:
    const filtros = {
      nombre: !this.nombreBusqueda ? '' : this.nombreBusqueda,
      numeroNomina: !this.numeroNominaBusqueda ? '' : this.numeroNominaBusqueda,
      empresaId: !this.empresaSeleccionada?.idEmpresa ? '' : this.empresaSeleccionada?.idEmpresa
    };

    this.empleadoService.buscarEmpleados(filtros).subscribe({
      next: (data) => {
        console.log(data)
        this.empleados = data;
        this.totalRegistros = this.empleados.length;
        this.loading = false;
        // Mostrar mensaje de éxito
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo realizar la búsqueda'
        });
        this.loading = false;
      }
    });
  }
  nuevoEmpleado() {

    this.router.navigate(['/registro-empleado']);
  }

  limpiarBusqueda() {
    this.nombreBusqueda = '';
    this.numeroNominaBusqueda = '';
    this.empresaSeleccionada = null;
    this.empleados = [];
    this.busquedaRealizada = false;

    this.messageService.add({
      severity: 'info',
      summary: 'Búsqueda limpiada',
      detail: 'Los filtros han sido restablecidos'
    });
  }

  editarEmpleado(empleado: EmpleadoBusqueda) {
    console.log('Editar empleado:', empleado);
    this.messageService.add({
      severity: 'info',
      summary: 'Editar empleado',
      detail: `Editando: ${empleado.nombreCompleto}`
    });

    // Navegar a la página de edición
    this.router.navigate(['/empleados/editar', empleado.idEmpleado]);
  }
  borrarEmpleado(empleado: EmpleadoBusqueda) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de ${empleado.estatus ? 'desactivar' : "activar"} el empleado: "${empleado.nombreCompleto}"?`,
      header: 'Confirmar edición de empleado',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-danger',

      accept: () => {
        // Aquí harías la llamada al servicio para eliminar
        this.empleadoService.eliminarEmpleado(empleado.idEmpleado, this.usuarioLogueado, !empleado.estatus).subscribe({
          next: (data) => {

            this.messageService.add({
              severity: 'success',
              summary: 'Cambio de estatus',
              detail: `El rol "${empleado.nombreCompleto}" ha sido actualizado`
            });

            this.buscarEmpleados();

          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          },
        })


      }
    });
  }
  getSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  getEstadoLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

}