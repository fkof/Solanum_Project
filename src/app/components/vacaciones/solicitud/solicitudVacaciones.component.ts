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

import { SaldosVacaciones } from '../../../models/saldosVacaciones';
import { TagModule } from 'primeng/tag';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { SolicitudVacacionesRequest } from '../../../models/solicitudVacacionesRequest';
import { TooltipModule } from 'primeng/tooltip';
import { GlobalHelpers } from '../../../helpers/GlobalHerpers';
registerLocaleData(localeEs, 'es-MX'); //Esto no es un import, pero va justo despues de ellos!

@Component({
    selector: 'solicitudVacaciones',
    templateUrl: 'solicitudVacaciones.component.html',
    styleUrls: ['./solicitudVacaciones.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, TooltipModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule, TagModule],
    providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-MX' }, GlobalHelpers]
})

export class SolicitudVacacionesEmp implements OnInit {
    loading: boolean = false;
    minDate: Date = new Date();
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesVacaciones: SolicitudVacaciones[] = []
    isCollapsed: boolean = false
    idEmpleado: number = 0;
    vacAcomuladas: boolean = false;
    showDialog: boolean = false;
    minDiasSol: number = 0;
    saldoDias: number = 0;
    saldosAcomulados: SaldosVacaciones[] = [];
    diasPedidos: number = 0;
    solicitudRequest: SolicitudVacacionesRequest = {} as SolicitudVacacionesRequest;
    correoEmpleado: string = "";
    diasExtras: number = 0;
    diasExtrasTotal: number = 0;
    constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
        public sidebarService: SideBarService, private vacacionesServices: VacacionesServices,
        public globalHelpers: GlobalHelpers) {
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idEmpleado = dataPerfil.usuario.idEmpleado;
        this.correoEmpleado = dataPerfil.usuario.correo;
    }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })
        this.vacacionesServices.getConfiguracion().subscribe({
            next: data => {
                let _minDiasAnti = data.find(x => x.idConfiguracion == 5)?.valor;
                //  let _vacAcomuladas = data.find(x => x.idConfiguracion == 3)?.valor;
                let _minDias = data.find(x => x.idConfiguracion == 1)?.valor;


                if (_minDias != null)
                    this.minDiasSol = parseInt(_minDias);


                if (_minDiasAnti != null)
                    this.minDate.setDate(this.minDate.getDate() + parseInt(_minDiasAnti.toString()));



                console.log(this.minDate)
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });

            }
        });
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
        this.getSaldosDias();
        this.getSolicitudesPendientes();
    }
    Solicitar() {
        let diasDiff = 0
        debugger;
        if (this.fechaInicial && this.fechaFinal) {
            if (this.fechaFinal <= this.fechaInicial) {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Fechas Incorrectas',
                    detail: 'La fecha Final no debe ser menor  que el la fecha Inicial'

                });
                return;
            }
        }
        if (this.fechaInicial && this.fechaFinal) {
            const timeDiff = this.fechaFinal.getTime() - this.fechaInicial.getTime();
            diasDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 para incluir el día inicial
        }
        diasDiff -= this.countWeekends(this.fechaInicial!, this.fechaFinal!);
        diasDiff -= this.countDisabledDates(this.fechaInicial!, this.fechaFinal!);
        if (diasDiff < this.minDiasSol) {
            this.messageService.add({
                severity: 'info',
                summary: 'Limite de dias',
                detail: `La cantidad minima a dias es minimo de ${this.minDiasSol}`

            });
            return;
        }

        if (this.exiteEnSolicitudes(this.fechaInicial!, this.fechaFinal!)) {
            this.messageService.add({
                severity: 'info',
                summary: 'Solicitud existente',
                detail: `Ya existe una solicitud en las fechas seleccionadas`
            });
            return;
        }
        if (diasDiff > this.saldoDias) {
            this.diasExtras = this.saldoDias - diasDiff;
            this.confirmationService.confirm({
                message: `Tienes saldo insuficiente, el excedente se tomara de tus dias de vacaciones de tu próximo periodo, ¿Deseas continuar?`,
                header: 'Confirmación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                rejectButtonStyleClass: 'p-button-danger',
                accept: () => {


                    this.showDialog = true;
                    this.diasPedidos = diasDiff
                    this.diasExtras = Math.abs(this.diasExtras)
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Solicitud cancelada',
                        detail: `La solicitud ha sido cancelada`
                    });
                    return;
                }

            });




            // this.messageService.add({
            //     severity: 'info',
            //     summary: 'Saldo insuficiente',
            //     detail: `No cuentas con los dias suficientes, tu saldo actual es de ${this.saldoDias} dias`
            // });
            // return;
        } else {
            this.showDialog = true;
            this.diasPedidos = diasDiff
        }



    }
    envioSolicitud() {
        this.showDialog = false;
        this.solicitudRequest = {
            idEmpleado: this.idEmpleado,
            fechaInicio: this.fechaInicial!,
            fechaFin: this.fechaFinal!,
            cantidadDias: this.diasPedidos,
            fechaRegreso: this.getFechaRetorno(),
            idEstatus: 1,
            idUsuarioCreacion: this.idEmpleado,
            correo: this.correoEmpleado,
            cantidadDiasAdelantados: this.diasExtras,

        }
        this.loading = true;
        this.vacacionesServices.postSolicitudVacaciones(this.solicitudRequest).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud Enviada',
                    detail: 'La solicitud de vacaciones ha sido enviada correctamente'

                })
                this.getSolicitudesPendientes();
                this.getSaldosDias();
                this.solicitudRequest = {} as SolicitudVacacionesRequest;
                this.fechaFinal = null;
                this.fechaInicial = null;
            },
            error: error => {
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
    preguntaCancelarSolicitud(solicitud: SolicitudVacaciones) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de cancelar la solicitud"?`,
            header: 'Cancelacion Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            //  acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                // Aquí harías la llamada al servicio para eliminar
                this.cancelarSolicitud(solicitud.idSolicitud);
                this.getSaldosDias();
                this.getSolicitudesPendientes();
            }
        });
    }
    cancelarSolicitud(idSolicitud: number) {
        let dataSend = {
            idSolicitud: idSolicitud,
            idEstatus: 4,
            motivoRechazo: 'Cancelacion por parte del colaborador',
            idUsuarioModificacion: this.idEmpleado
        }
        this.vacacionesServices.putActualizarSolicitud(dataSend).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Solicitud Cancelada',
                    detail: 'La solicitud de vacaciones ha sido cancelada correctamente'

                })
                this.getSaldosDias();
                this.getSolicitudesPendientes();
            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });
            }
        })
    }
    countWeekends(startDate: Date, endDate: Date): number {
        let count = 0;
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const day = currentDate.getDay();
            if (day === 0 || day === 6) {
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    }
    countDisabledDates(startDate: Date, endDate: Date): number {
        let count = 0;
        for (const disabledDate of this.disabledDates) {
            if (disabledDate >= startDate && disabledDate <= endDate) {
                count++;
            }
        }
        return count;
    }
    getFechaRetorno(): Date {
        if (this.fechaFinal) {
            const retorno = new Date(this.fechaFinal);
            retorno.setDate(retorno.getDate() + 1);
            while (retorno.getDay() === 0 || retorno.getDay() === 6 || this.isDisabledDate(retorno)) {
                retorno.setDate(retorno.getDate() + 1);
            }
            return retorno;
        }
        return new Date;
    }
    exiteEnSolicitudes(fechaInicial: Date, fechaFinal: Date): boolean {
        for (const solicitud of this.solicitudesVacaciones) {
            const inicioSolicitud = new Date(solicitud.fechaInicio);
            const finSolicitud = new Date(solicitud.fechaFin);
            if ((fechaInicial >= inicioSolicitud && fechaInicial <= finSolicitud) ||
                (fechaFinal >= inicioSolicitud && fechaFinal <= finSolicitud) ||
                (fechaInicial <= inicioSolicitud && fechaFinal >= finSolicitud)) {
                return true;
            }
        }
        return false;
    }
    isDisabledDate(date: Date): boolean {
        return this.disabledDates.some(disabledDate =>
            disabledDate.getFullYear() === date.getFullYear() &&
            disabledDate.getMonth() === date.getMonth() &&
            disabledDate.getDate() === date.getDate()
        );
    }

    getSolicitudesPendientes() {
        this.loading = true;
        this.vacacionesServices.getSolicitudesPendientesParaEmpleadoLogueado(this.idEmpleado).subscribe({
            next: data => {
                this.solicitudesVacaciones = data;
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al traer la solicitudes',
                    detail: error

                });
            }, complete: () => {
                this.loading = false;
            }
        })
    }
    getSaldosDias() {
        this.saldoDias = 0;
        this.vacacionesServices.getSaldos(this.idEmpleado).subscribe({
            next: saldos => {
                this.saldosAcomulados = saldos;
                if (saldos.length > 0) {
                    this.saldoDias = 0;
                    this.diasExtrasTotal = 0;
                    saldos.forEach(element => {
                        this.saldoDias += element.saldoDias
                        this.diasExtrasTotal += element.diasAdelantados
                    });
                } else {
                    this.saldoDias = 0;
                }

            }, error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error

                });

            }
        })
    }

    verBotonCancelar(solicitud: SolicitudVacaciones): boolean {
        return new Date(solicitud.fechaInicio) >= new Date()
    }
}