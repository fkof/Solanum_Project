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
import { SolicitudVacaciones } from '../../../models/solicitudesVacaciones';
import { SideBarService } from '../../../services/sideBar.services';
import { VacacionesServices } from '../../../services/vacaciones.services';
import { EstatusVacaciones } from '../../../models/estatusVacaciones';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RolService } from '../../../services/rol.services';
import { Rol } from '../../../models/rol';
import { TooltipModule } from 'primeng/tooltip';
import { Tag, TagModule } from 'primeng/tag';
import { GlobalHelpers } from '../../../helpers/GlobalHerpers';
@Component({
    selector: 'vacacionesAAprobar',
    templateUrl: 'vacacionesAAprobar.component.html',
    styleUrls: ['./vacacionesAAprobar.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, InputTextModule, TooltipModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule, SelectModule],
    providers: [MessageService, ConfirmationService, GlobalHelpers]
})

export class VacacionesAAprobar implements OnInit {
    loading: boolean = false;
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesVacaciones: SolicitudVacaciones[] = []
    isCollapsed: boolean = false
    listEstatus: EstatusVacaciones[] = [];
    estatusSeleccionado: number = 0
    nombreBusqueda: string = "";
    idRoles: string = "";
    idAutorizandor: string = "";
    rolesList: Rol[] = [];
    motivoRechazo: string = "";
    showDialog: boolean = false;
    selectSolicitud: SolicitudVacaciones | null = null;
    showMotivos: boolean = false;
    constructor(private messageService: MessageService, public sidebarService: SideBarService,
        private vacacionesService: VacacionesServices,
        private rolService: RolService, public confirmationService: ConfirmationService, public globalHelpers: GlobalHelpers) {

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
        //console.log(this.isAdminOrRecursosHumanos(this.idRoles))
        let isAdminORRH = this.isAdminOrRecursosHumanos(this.idRoles)
        let dataSend = {
            nombre: this.nombreBusqueda,
            idEmpleado: null,
            idAutorizador: !isAdminORRH ? this.idAutorizandor : "",
            idEstatus: this.estatusSeleccionado > 0 ? this.estatusSeleccionado : "",
            fechaInicio: this.fechaInicial?.toLocaleDateString('en-US'),
            fechaFin: this.fechaFinal?.toLocaleDateString('en-US')
        }
        this.vacacionesService.getSolicitudesVacaciones(dataSend).subscribe({
            next: solicitudes => {
                this.solicitudesVacaciones = solicitudes;
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

            const worksheet = xlsx.utils.json_to_sheet(this.solicitudesVacaciones);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            xlsx.writeFile(workbook, 'Solicitudes_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    };

    selectSolicitudApprove(solicitud: SolicitudVacaciones) {
        this.selectSolicitud = solicitud;
        this.showDialog = true;
    }
    preguntaCancelar() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de rechazar la solicitud?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.cancelarSolicitud();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'La solicitud ha sido cancelada correctamente'
                });
            }
        });
    }
    cancelarSolicitud() {
        let dataSend = {
            idSolicitud: this.selectSolicitud?.idSolicitud,
            idEstatus: 3,
            motivoRechazo: this.motivoRechazo,
            idUsuarioModificacion: this.idAutorizandor
        }
        this.showDialog = false;
        this.showMotivos = false;
        this.loading = false;
        this.vacacionesService.putActualizarSolicitud(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud Rechazada',
                    detail: 'La solicitud de vacaciones ha sido rechazada correctamente'

                })
                this.showDialog = false;
                this.showMotivos = false;
                this.buscarsolicitudes();
                this.loading = false;
            }, error: error => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });
            }
        })
    }
    preguntaAprobar() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de aprobar la solicitud?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.aprobarSolicitud();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'La solicitud no ha sido aprobada'
                });
            }
        });
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
        this.showDialog = false;
        this.loading = true;
        this.vacacionesService.putActualizarSolicitud(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud Aprobada',
                    detail: 'La solicitud de vacaciones ha sido aprobada correctamente'

                })

                this.buscarsolicitudes();
                this.loading = false;
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