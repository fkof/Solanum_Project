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
import { TagModule } from 'primeng/tag';
import { SolicitudPermiso } from '../../../models/SolicitudPermiso';
import { PermisoServices } from '../../../services/permisos.services';

@Component({
    selector: 'historialPermisosSolicitudes',
    templateUrl: 'historialPermisosSolicitudes.component.html',
    styleUrls: ['./historialPermisosSolicitudes.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule],
    providers: [MessageService, ConfirmationService]
})

export class HistorialPermisosSolicitudes implements OnInit {
    loading: boolean = false;
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesPermiso: SolicitudPermiso[] = []
    isCollapsed: boolean = false
    idEmpleado: number = 0;
    constructor(private messageService: MessageService, public sidebarService: SideBarService, private permisoServices: PermisoServices) {
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idEmpleado = dataPerfil.usuario.idEmpleado;
    }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })


    }
    buscarsolicitudes() {
        this.loading = true;
        let dataSend = {
            nombre: "",
            idEmpleado: this.idEmpleado,
            idAutorizador: "",
            idEstatus: "",
            fechaInicio: this.fechaInicial?.toLocaleDateString('en-US'),
            fechaFin: this.fechaFinal?.toLocaleDateString('en-US')
        }
        this.permisoServices.getSolicitudesPermiso(dataSend).subscribe({
            next: solicitudes => {
                this.solicitudesPermiso = solicitudes;
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
    formatearFechastr(fechastr: string): string {
        let fecha = new Date(fechastr);

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear().toString().slice(-2);

        return `${dia}-${mes}-${año}`;
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
    formatearFecha(fecha: Date): string {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear().toString().slice(-2);

        return `${dia}-${mes}-${año}`;
    }

}