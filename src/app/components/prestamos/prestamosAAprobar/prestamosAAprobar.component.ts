import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { SideBarService } from '../../../services/sideBar.services';
import { EstatusVacaciones } from '../../../models/estatusVacaciones';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RolService } from '../../../services/rol.services';
import { Rol } from '../../../models/rol';
import { TooltipModule } from 'primeng/tooltip';
import { Tag, TagModule } from 'primeng/tag';
import { SolicitudPermiso } from '../../../models/SolicitudPermiso';
import { PermisoServices } from '../../../services/permisos.services';
import { VacacionesServices } from '../../../services/vacaciones.services';
import { PrestamosServices } from '../../../services/prestamos.services';
import { SolicitudPrestamos } from '../../../models/solicitudPrestamos';
import { GlobalHelpers } from '../../../helpers/GlobalHerpers';
@Component({
    selector: 'prestamosAAprobar',
    templateUrl: 'prestamosAAprobar.component.html',
    styleUrls: ['./prestamosAAprobar.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, InputTextModule, TooltipModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule, SelectModule],
    providers: [MessageService, ConfirmationService, GlobalHelpers]
})

export class PrestamosAAprobar implements OnInit {
    loading: boolean = false;
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesPrestamos: SolicitudPrestamos[] = []
    isCollapsed: boolean = false
    listEstatus: EstatusVacaciones[] = [];
    estatusSeleccionado: number = 0
    nombreBusqueda: string = "";
    idRoles: string = "";
    idAutorizandor: string = "";
    rolesList: Rol[] = [];
    motivoRechazo: string = "";
    showDialog: boolean = false;
    selectSolicitud: SolicitudPrestamos | null = null;
    showMotivos: boolean = false;
    constructor(private messageService: MessageService, public sidebarService: SideBarService,
        private prestamosService: PrestamosServices,
        private vacacionesService: VacacionesServices,
        private rolService: RolService,
        public globalHelpers: GlobalHelpers) {

        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idAutorizandor = dataPerfil.usuario.idEmpleado;
        this.idRoles = dataPerfil.usuario.idRoles;
    }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })
        this.vacacionesService.getListEstatus().subscribe({
            next: data => {
                this.listEstatus = data;

            }
        })
        this.getAllRoles();

    }
    buscarsolicitudes() {
        this.loading = true;
        console.log(this.isAdminOrRecursosHumanos(this.idRoles))
        let isAdminORRH = this.isAdminOrRecursosHumanos(this.idRoles)
        let dataSend = {
            nombre: this.nombreBusqueda,
            idEmpleado: null,
            idAutorizador: !isAdminORRH ? this.idAutorizandor : "",
            idEstatus: this.estatusSeleccionado > 0 ? this.estatusSeleccionado : "",
            fechaInicio: this.fechaInicial?.toLocaleDateString('en-US'),
            fechaFin: this.fechaFinal?.toLocaleDateString('en-US')
        }
        this.prestamosService.getSolicitudesPrestamos(dataSend).subscribe({
            next: solicitudes => {
                this.solicitudesPrestamos = solicitudes;
                this.loading = false;
            }
        })
    }
    getAllRoles() {
        this.rolService.getAll().subscribe({
            next: roles => {
                this.rolesList = roles;
            }
        })
    }
    isAdminOrRecursosHumanos(idRole: string): boolean {
        const rolesArray = idRole.split(',')
        let found = false;
        rolesArray.forEach(idRol => {
            var data = this.rolesList.find(rol => rol.idRol == parseInt(idRol))
            if (data?.nombre.toLowerCase() == 'administrador' || data?.nombre.toLowerCase() == 'recursos humanos') {
                found = true;
                return
            }
        })
        return found;
    }
    handleExportExcel() {

        import('xlsx').then((xlsx) => {
            let EXCEL_EXTENSION = '.xlsx';

            const worksheet = xlsx.utils.json_to_sheet(this.solicitudesPrestamos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            xlsx.writeFile(workbook, 'Solicitudes_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    };

    selectSolicitudApprove(solicitud: SolicitudPrestamos) {
        this.selectSolicitud = solicitud;
        this.showDialog = true;
    }
    cancelarSolicitud() {
        let dataSend = {
            idSolicitud: this.selectSolicitud?.idSolicitud,
            idEstatus: 3,
            motivoRechazo: this.motivoRechazo,
            idUsuarioModificacion: this.idAutorizandor
        }
        this.prestamosService.actualizarSolicitudPrestamo(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud Rechazada',
                    detail: 'La solicitud del permiso ha sido rechazada correctamente'

                })
                this.showDialog = false;
                this.showMotivos = false;
                this.buscarsolicitudes();
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });
            }
        })
    }
    aprobarSolicitud() {
        if (!this.selectSolicitud) {
            return;
        }
        let dataSend = {
            idSolicitud: this.selectSolicitud?.idSolicitud,
            idEstatus: 2,
            motivoRechazo: 'Aprobación por parte del autorizador',
            idUsuarioModificacion: this.idAutorizandor
        }
        this.prestamosService.actualizarSolicitudPrestamo(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud Aprobada',
                    detail: 'La solicitud del permiso ha sido aprobada correctamente'

                })
                this.showDialog = false;
                this.buscarsolicitudes();
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });
            }
        })
    }
}