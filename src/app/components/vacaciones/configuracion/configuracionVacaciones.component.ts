import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { SolicitudVacaciones } from '../../../models/solicitudesVacaciones';
import { SideBarService } from '../../../services/sideBar.services';
import { VacacionesServices } from '../../../services/vacaciones.services';
import { EditorModule } from 'primeng/editor';
import { ConfiguracionVacaciones as Conf } from '../../../models/configuracionVacaciones';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";


@Component({
    selector: 'configuracionVacaciones',
    templateUrl: 'configuracionVacaciones.component.html',
    styleUrls: ['./configuracionVacaciones.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule,
        FormsModule, ButtonModule, TableModule, TooltipModule, EditorModule],
    providers: [MessageService, ConfirmationService,]
})

export class ConfiguracionVacaciones implements OnInit {
    loading: boolean = false;
    minDate: Date = new Date();
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesVacaciones: SolicitudVacaciones[] = [];
    isCollapsed: boolean = false
    veAcomulables: boolean = false;
    //Borrar pa riba
    showDialog: boolean = false;
    configuraciones: Conf[] = [];
    clonedConfig: { [s: string]: Conf } = {};
    idEmpleado: number = 0;
    toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme



    ];

    constructor(private messageService: MessageService, public sidebarService: SideBarService,
        public vacacionesService: VacacionesServices, private sanitizer: DomSanitizer) {
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idEmpleado = dataPerfil.usuario.idEmpleado;


    }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })
        this.vacacionesService.getConfiguracion().subscribe({
            next: data => {
                this.configuraciones = data;
            }
        })

    }
    editarConfiguracion(e: any) {
        this.showDialog = true;
    }

    onRowEditInit(config: Conf) {
        this.clonedConfig[config.idConfiguracion as number] = { ...config };
        console.log("clonedConfig", this.clonedConfig);
    }

    onRowEditSave(config: Conf, index: number) {

        if (config.valor.length >= 0) {
            let valoresnuevo = this.clonedConfig[config.idConfiguracion as number];
            valoresnuevo.valor = config.valor;
            let dataSend = {
                "idConfiguracion": config.idConfiguracion,
                "valor": config.valor,
                "idUsuarioModificacion": this.idEmpleado
            }
            this.vacacionesService.putConfiguracion(dataSend).subscribe({
                next: data => {
                    this.messageService.add({ severity: 'success', summary: 'Extio', detail: data.mensaje });
                    this.vacacionesService.getConfiguracion().subscribe({
                        next: data => {
                            this.configuraciones = data;
                        }
                    })
                }
            })

        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Valor inválido' });

            this.onRowEditCancel(config, index);
        }
    }

    onRowEditCancel(config: Conf, index: number) {
        this.configuraciones[index] = this.clonedConfig[config.idConfiguracion as number];
        delete this.clonedConfig[config.idConfiguracion as number];
    }
    getSanitizedHtml(texto: string): SafeHtml {

        let previewNoticia = texto.indexOf("<p>");
        let clasep = ""
        if (previewNoticia === -1) {
            texto = "<p style='width: 350px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>" + texto + "</p>";
        } else {
            clasep = "width: 350px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
            let noticiaReemplazo = texto.replaceAll("<p>", "<p style='" + clasep + "'>");
            texto = noticiaReemplazo;
        }
        let sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(texto);
        return sanitizedHtml;
    }
}