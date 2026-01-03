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
import { SolicitudPrestamos } from '../../../models/solicitudPrestamos';
import { PrestamosServices } from '../../../services/prestamos.services';
import { GlobalHelpers } from '../../../helpers/GlobalHerpers';

@Component({
    selector: 'historialSolicitudes',
    templateUrl: 'historialSolicitudes.component.html',
    styleUrls: ['./historialSolicitudes.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule],
    providers: [MessageService, ConfirmationService, GlobalHelpers]
})

export class HistorialSolicitudesPrestamos implements OnInit {
    loading: boolean = false;
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesPrestamos: SolicitudPrestamos[] = []
    isCollapsed: boolean = false
    idEmpleado: number = 0;
    constructor(private messageService: MessageService, public sidebarService: SideBarService,
        private prestamosServices: PrestamosServices, public globalHelpers: GlobalHelpers) {
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
        this.prestamosServices.getSolicitudesPrestamos(dataSend).subscribe({
            next: solicitudes => {
                this.solicitudesPrestamos = solicitudes;
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


}