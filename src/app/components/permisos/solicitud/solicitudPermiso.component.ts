import { Component } from "@angular/core";
import { DatePickerModule } from "primeng/datepicker";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { TagModule } from "primeng/tag";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { SideBarService } from "../../../services/sideBar.services";
import { DropdownModule } from "primeng/dropdown";
import { VacacionesServices } from "../../../services/vacaciones.services";
import { TooltipModule } from "primeng/tooltip";
import { PermisoServices } from "../../../services/permisos.services";
import { TipoPermiso } from "../../../models/tipoPermiso";
@Component({
    selector: 'app-solicitudPermiso',
    templateUrl: './solicitudPermiso.component.html',
    styleUrls: ['./solicitudPermiso.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule, DropdownModule, TooltipModule],
    providers: [MessageService, ConfirmationService, SideBarService]
})
export class SolicitudPermisoComponent {
    loading: boolean = false;
    fechaPermiso: Date = new Date();
    maxDate: Date = new Date();
    minDate: Date = new Date();
    isCollapsed: boolean = false
    idEmpleado: number = 0;
    tipoPermiso: TipoPermiso[] = [];
    selectedTipoPermiso: number = 0;
    disabledDates: Date[] = [];
    solicitudesPermiso: any[] = [];
    constructor(private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public sidebarService: SideBarService,
        public vacacionesServices: VacacionesServices,
        public permisoServices: PermisoServices) {
        this.maxDate.setMonth(this.maxDate.getMonth() + 3);
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idEmpleado = dataPerfil.usuario.idEmpleado;
        this.fechaPermiso.setDate(this.fechaPermiso.getDate() + 1);
        this.minDate.setDate(this.minDate.getDate());
    }
    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })
        this.permisoServices.getTipoPermiso().subscribe({
            next: data => {
                this.tipoPermiso = data;
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
            }
        })
        this.getSolicitudesPendientes();
        this.vacacionesServices.getDiasFestivos().subscribe({
            next: data => {
                //   const nombres = miArray.map(objeto => objeto.nombre);
                this.disabledDates = data.map(objeto => new Date(objeto.diaFestivo));

            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });
            }
        })
    }
    getSolicitudesPendientes() {

        this.loading = true;
        this.permisoServices.getSolicitudesPendientesParaEmpleadoLogueado(this.idEmpleado).subscribe({
            next: data => {
                this.solicitudesPermiso = data;
                this.loading = false;
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
            }, complete: () => {
                this.loading = false;
            }
        })
    }
    handleSolcitud() {
        if (this.solicitudesPermiso.find(solicitud => new Date(solicitud.fechaPermiso) == this.fechaPermiso)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ya tienes una solicitud pendiente para esta fecha'
            });
            this.loading = false;
            return;
        }
        console.log(this.selectedTipoPermiso);
        console.log(this.fechaPermiso);
        if (this.selectedTipoPermiso == 0 || this.fechaPermiso == null) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar un tipo de permiso y una fecha'
            });
            return;
        }
        let SolicitudPermisoRequest = {
            idEmpleado: this.idEmpleado,
            fechaPermiso: this.fechaPermiso,
            idTipoPermiso: this.selectedTipoPermiso,
            idUsuarioCreacion: this.idEmpleado
        }
        this.loading = true;
        this.permisoServices.postSolicitudPermiso(SolicitudPermisoRequest).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Permiso solicitado correctamente'
                });
                this.getSolicitudesPendientes();
            }, error: error => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
            }, complete: () => {
                this.loading = false;
            }
        })
    }
    getSeverityStatus(estatus: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
        switch (estatus) {
            case 'Pendiente':
                return 'warn';
            case 'Aprobada':
                return 'success';
            case 'Rechazada':
                return 'danger';
            default:
                return 'info';
        }
    }
    preguntaCancelarSolicitud(solicitud: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de cancelar la solicitud"?`,
            header: 'Cancelacion Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            // acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.cancelarSolicitud(solicitud.idSolicitud);
            },
            reject: () => {

            }
        });
    }
    cancelarSolicitud(solicitud: number) {
        this.loading = true;
        let dataSend = {
            idSolicitud: solicitud,
            idEstatus: 4,
            motivoRechazo: 'Cancelacion por parte del colaborador',
            idUsuarioModificacion: this.idEmpleado
        }
        this.permisoServices.actualizarSolicitudPermiso(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Solicitud cancelada correctamente'
                });
                this.getSolicitudesPendientes();
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
            }, complete: () => {
                this.loading = false;
            }
        })
    }
    verBotonCancelar(solicitud: any): boolean {
        return new Date(solicitud.fechaPermiso) >= new Date()
    }
    formatearFechastr(fechastr: string): string {
        let fecha = new Date(fechastr);

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear().toString().slice(-2);

        return `${dia}-${mes}-${año}`;
    }
}