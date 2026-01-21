import { FormsModule } from '@angular/forms';

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Editor } from "primeng/editor";
import { Button } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from 'primeng/api';

import { TextareaModule } from 'primeng/textarea';
import { LOCALE_ID } from "@angular/core";
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { GalleriaModule } from "primeng/galleria";

import { Dialog } from "primeng/dialog";
import { FileUpload } from "primeng/fileupload";
import { RolService } from '../../../services/rol.services';
import { MultiSelectModule } from "primeng/multiselect";
import { Encuestas } from '../../../models/encuestas';
import { EncuestasService } from '../../../services/encuestas.services';
import { Rol } from '../../../models/rol';
@Component({
    selector: 'app-encuestasConfig',
    templateUrl: './encuestasConfig.component.html',
    styleUrls: ['./encuestasConfig.component.scss'],
    imports: [FormsModule, Button, ToastModule, ConfirmDialogModule, CardModule,
        DividerModule, InputTextModule, TextareaModule, TableModule, TooltipModule,
        GalleriaModule, MultiSelectModule],
    providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-MX' }, FileUpload]

})
export class EncuestasConfigComponent implements OnInit {

    usuarioLogueado: number = 0;
    arrayEncuestas: Encuestas[] = [];
    encuesta: Encuestas = {
        idEncuesta: 0,
        titulo: '',
        descripcion: '',
        link: '',
        idUsuarioModificacion: 0,
        idRoles: '',
        rolesDescripcion: '',
        idUsuarioCreacion: 0,
        linksafe: ''
    };
    arrayRoles: Rol[] = [];
    loading: boolean = false;
    selectedRoles: Rol[] = [];

    constructor(private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private encuestasService: EncuestasService,
        private rolService: RolService) {

        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.usuarioLogueado = dataPerfil.usuario.idEmpleado;
    }
    ngOnInit(): void {
        this.getRoles();
        this.getEncuestas();
    }
    getRoles() {
        this.rolService.getAll().subscribe({
            next: (data) => {
                this.arrayRoles = data;
            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
    }
    getEncuestas() {
        this.encuestasService.getAllEncuestas().subscribe({
            next: (data) => {
                this.arrayEncuestas = data;
            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
    }

    saveEncuesta() {
        this.encuesta.idUsuarioModificacion = this.usuarioLogueado;
        this.encuesta.idUsuarioCreacion = this.usuarioLogueado;
        if (this.encuesta.link === "" || this.encuesta.link === null || this.encuesta.link === undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El link es obligatorio'
            });
            return;
        }
        if (this.selectedRoles.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Se debe seleccionar al menos un rol'
            });
            return;
        }
        this.encuesta.idRoles = this.selectedRoles.map((rol) => rol.idRol).join(',');

        /*if (this.encuesta.titulo === "" || this.encuesta.titulo === null || this.encuesta.titulo === undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El titulo es obligatorio'
            });
            return;
        }
*/
        if (this.encuesta.idEncuesta === 0) {
            this.loading = true;
            let formData = new FormData();
            formData.append("link", this.encuesta.link);
            formData.append("idUsuarioCreacion", this.usuarioLogueado.toString());
            formData.append("idRoles", this.encuesta.idRoles);
            this.encuestasService.createEncuestas(formData).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Encuesta guardada correctamente'
                    });
                    this.getEncuestas();
                    this.encuesta = {
                        idEncuesta: 0,
                        titulo: '',
                        descripcion: '',
                        link: '',
                        linksafe: '',
                        idUsuarioModificacion: 0,
                        idRoles: '',
                        rolesDescripcion: ''
                    };
                    formData.delete("link");
                    formData.delete("idUsuarioCreacion");
                    formData.delete("idRoles");

                    this.selectedRoles = [];
                    this.loading = false;
                }, error: (data) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: data
                    });
                    this.loading = false;
                }
            })
        } else {
            //  this.formData.delete("imagen");
            this.loading = true;
            this.encuesta.idUsuarioModificacion = this.usuarioLogueado;
            let formData = new FormData();
            formData.append("idEncuesta", this.encuesta.idEncuesta.toString());
            formData.append("link", this.encuesta.link);
            formData.append("idUsuarioModificacion", this.usuarioLogueado.toString());
            formData.append("idRoles", this.encuesta.idRoles);
            this.encuestasService.updateEncuestas(formData).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Encuesta actualizada correctamente'
                    });
                    this.getEncuestas();
                    this.encuesta = {
                        idEncuesta: 0,
                        titulo: '',
                        descripcion: '',
                        linksafe: '',
                        link: '',
                        idUsuarioModificacion: 0,
                        idRoles: '',
                        rolesDescripcion: ''
                    };
                    formData.delete("link");
                    formData.delete("idUsuarioModificacion");
                    formData.delete("idRoles");
                    formData.delete("idEncuesta");
                    this.selectedRoles = [];
                    this.loading = false;
                }, error: (data) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: data
                    });
                    this.loading = false;
                }
            })
        }
    }

    deleteEncuesta(idEncuesta: number) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar esta encuesta?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.loading = true;
                this.encuestasService.deleteEncuestas(idEncuesta).subscribe({
                    next: (data) => {
                        this.loading = false;
                        this.getEncuestas()
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exito',
                            detail: 'Encuesta eliminada correctamente'
                        });
                        this.getEncuestas();
                    }, error: (data) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: data
                        });
                    }
                })
            }
        })
    }
    selectEncuestaEdit(encuesta: Encuestas) {
        this.encuesta = encuesta;
        this.selectedRoles = this.arrayRoles.filter((rol) => this.encuesta.idRoles.split(',').includes(rol.idRol.toString()));
    }


}