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
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from 'primeng/inputnumber';
import { PrestamosServices } from "../../../services/prestamos.services";
import { CantidadRebaje } from "../../../models/cantidadRebaje";
import { MessageModule, Message } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { GlobalHelpers } from "../../../helpers/GlobalHerpers";
@Component({
    selector: 'app-solicitudPrestamo',
    templateUrl: './solicitudPrestamo.component.html',
    styleUrls: ['./solicitudPrestamo.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule, DropdownModule, TooltipModule, InputTextModule, InputNumberModule, Message, PanelModule],
    providers: [MessageService, ConfirmationService, SideBarService, GlobalHelpers]
})
export class SolicitudPrestamoComponent {
    loading: boolean = false;

    isCollapsed: boolean = false
    idEmpleado: number = 0;
    motivo: string = "";
    montoSolicitado: number = 0;
    solicitudesPermiso: any[] = [];
    cantidadRebaje: CantidadRebaje[] = [];
    veResumen: boolean = false;
    selectedCantidadRebaje: CantidadRebaje | null = null;
    simulacionAmortizacion: any[] = [];
    constructor(private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public sidebarService: SideBarService,
        public prestamosServices: PrestamosServices,
        public globalHelpers: GlobalHelpers
    ) {
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idEmpleado = dataPerfil.usuario.idEmpleado;
    }
    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })

        this.getSolicitudesPendientes();
        this.getListadoCantidadRebaje();
    }
    abrirCerrarMortizacion(event: any) {
        console.log(event);
        if (!event) {
            this.loading = true;
            this.prestamosServices.getSimulacionAmortizacion({
                montoSolicitado: this.montoSolicitado,
                idRebaje: this.selectedCantidadRebaje?.idRebajePrestamo
            }).subscribe({
                next: data => {
                    this.simulacionAmortizacion = [];
                    this.simulacionAmortizacion = data;
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
    }
    getSolicitudesPendientes() {

        this.loading = true;
        this.prestamosServices.getSolicitudesPendientesParaEmpleadoLogueado(this.idEmpleado).subscribe({
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
    getListadoCantidadRebaje() {
        this.prestamosServices.getListadoCantidadRebaje().subscribe({
            next: data => {
                this.cantidadRebaje = data;
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
    envioSolicitud() {
        if (!this.selectedCantidadRebaje) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar una cantidad de rebaje'
            });
            return;
        }
        if (!this.montoSolicitado) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe ingresar un monto solicitado'
            });
            return;
        }
        if (!this.motivo) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe ingresar un motivo'
            });
            return;
        }

        this.veResumen = true;
        this.simulacionAmortizacion = [];
        this.abrirCerrarMortizacion(false);
        console.log(this.selectedCantidadRebaje);
    }
    handleSolcitud() {

        this.loading = true;
        let dataSend = {
            idEmpleado: this.idEmpleado,
            motivo: this.motivo,
            idRebajePrestamo: this.selectedCantidadRebaje?.idRebajePrestamo,
            montoSolicitado: this.montoSolicitado,
            idUsuarioCreacion: this.idEmpleado,
        }
        this.prestamosServices.postSolicitudPrestamos(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Solicitud creada correctamente'
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
        this.prestamosServices.actualizarSolicitudPrestamo(dataSend).subscribe({
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



}